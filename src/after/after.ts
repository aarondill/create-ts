export { after };
// Types
import type { Options } from "create-create-app";
import type { PackageJson } from "type-fest";
// Built-ins
import fs from "fs/promises";
import path from "path";
// Dependencies
import sortPackageJson from "sort-package-json";
// My code
import { copy } from "create-create-app";
import {
	moveChosenEslintrc,
	setEslintRootFalse,
	setJestOverrideEslint,
} from "./eslint.js";
import { createGithubRepo } from "./github.js";

const after: Options["after"] = async ({
	answers,
	installNpmPackage,
	packageDir,
	run,
	packageManager,
	templateDir,
	year,
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

	try {
		await moveChosenEslintrc({ packageDir, answers });
	} catch (e) {
		console.error(`something went wrong when choosing .eslintrc.cjs: \n${e}`);
	}
	try {
		await setEslintRootFalse({ packageDir, answers });
	} catch (e) {
		console.error(
			`something went wrong when changing root status of .eslintrc.cjs: \n${e}`
		);
	}
	try {
		await setJestOverrideEslint({ packageDir, answers });
	} catch (e) {
		console.error(
			`something went wrong when setting the jest override in .eslintrc.cjs: \n${e}`
		);
	}

	// Sort the package.json
	const sortedPackageJson = sortPackageJson(packageJson);

	// Stringify, tab indented
	const packageJsonString = JSON.stringify(sortedPackageJson, null, "\t");
	// Write the package.json
	await fs.writeFile(packageJsonPath, packageJsonString);

	console.log(`Updating packages using ${packageManager}`);

	// This should update latest versions of everything
	await run(`${packageManager} install`);
	// This will write those versions the the package.json file
	await run(`${packageManager} update --save --latest`);

	await createGithubRepo({ answers, packageDir });
};
