export { after };
// Types
import type { Options } from "create-create-app";
import type { PackageJson } from "type-fest";
// Built-ins
import fs from "fs/promises";
import path from "path";
// Dependencies
import { run as ncuRun } from "npm-check-updates";
import sortPackageJson from "sort-package-json";
// My code
import { copy } from "create-create-app";
import {
	moveChosenEslintrc,
	setEslintEnvironments,
	setEslintRoot,
	setJestOverrideEslint,
} from "./eslint.js";
import { createGithubRepo } from "./github.js";
import { setTypeModule } from "./packageJson.js";

async function tryOrLog<P extends any[]>(
	func: (...args: P) => void | Promise<void>,
	onFail: (a: unknown) => string,
	...args: P
) {
	try {
		await func(...args);
	} catch (e) {
		console.error(onFail(e));
	}
}

const after: Options["after"] = async ({
	answers,
	packageDir,
	run,
	packageManager,
	templateDir,
	year,
	installNpmPackage,
}) => {
	// Copy the global template files
	const globalTemplateDir = path.resolve(
		templateDir,
		"..",
		"..",
		"templates-global"
	);
	await copy({
		sourceDir: globalTemplateDir,
		targetDir: packageDir,
		view: { ...answers, year, packageManager },
	});

	// Get the original package.json content
	const packageJsonPath = path.resolve(packageDir, "package.json");
	const originalPackageJsonString = await fs.readFile(packageJsonPath, "utf-8");
	const packageJson = JSON.parse(originalPackageJsonString) as PackageJson;

	packageJson.scripts ??= {};

	await tryOrLog(
		moveChosenEslintrc,
		e => `Something went wrong when choosing .eslintrc.cjs: \n` + String(e),
		{ packageDir, answers, packageJson }
	);

	await tryOrLog(
		setEslintRoot,
		e =>
			`Something went wrong when changing root status of .eslintrc.cjs: \n` +
			String(e),
		{ packageDir, answers }
	);
	await tryOrLog(
		setJestOverrideEslint,
		e =>
			`Something went wrong when setting the jest override in .eslintrc.cjs: \n` +
			String(e),
		{ packageDir, answers }
	);

	await tryOrLog(
		setEslintEnvironments,
		e =>
			`Something went wrong setting eslint environments in .eslintrc.cjs:\n` +
			String(e),
		{ packageDir, answers }
	);

	await tryOrLog(
		setTypeModule,
		e =>
			`Something went wrong setting type: modules in package.json:\n` +
			String(e),
		{ packageDir, answers }
	);

	// Sort the package.json
	const sortedPackageJson = sortPackageJson(packageJson);

	// Stringify, tab indented
	const packageJsonString = JSON.stringify(sortedPackageJson, null, "\t");
	// Write the package.json
	await fs.writeFile(packageJsonPath, packageJsonString);

	console.log(`Updating modules using ncu`);

	// Save latest versions of all modules to package.json
	await ncuRun({
		packageFile: packageJsonPath,
		upgrade: true,
	});

	console.log(`Installing modules using ${packageManager}`);
	if (packageManager === "yarn") {
		await fs.writeFile(path.join(packageDir, "yarn.lock"), "", "utf-8"); // If yarn, make an empty lock file
	}
	await run(`${packageManager} install`); // shockingly universal

	try {
		await createGithubRepo({ answers, packageDir });
	} catch (e) {
		console.error(e);
	}

	// Prettify it!
	try {
		await run(`${packageManager} run lint`);
	} catch (e) {
		console.error(
			`Error while running \`${packageManager} run lint\`: ${String(e)}`
		);
	}
};
