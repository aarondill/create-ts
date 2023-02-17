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
import { setEslintRootFalse } from "./eslint.js";
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
	copy({
		sourceDir: globalTemplateDir,
		targetDir: packageDir,
		view: { ...answers, year, packageManager },
	});

	// Get the original package.json content
	const packageJsonPath = path.resolve(packageDir, "package.json");
	const originalPackageJsonString = await fs.readFile(packageJsonPath, "utf-8");
	const packageJson = JSON.parse(originalPackageJsonString) as PackageJson;

	packageJson.scripts ??= {};

	if (!answers.eslintRoot) await setEslintRootFalse({ packageDir });

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
