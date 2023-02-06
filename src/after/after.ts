export { after };
// Types
import type { Options } from "create-create-app";
import type { PackageJson } from "type-fest";
// Built-ins
import fs from "fs/promises";
import { resolve } from "path";
// Dependencies
import { globby } from "globby";
import sortPackageJson from "sort-package-json";
// My code
import { createGithubRepo } from "./github.js";
import { initJest, removeJest } from "./jest.js";

const after: Options["after"] = async ({
	answers,
	installNpmPackage,
	packageDir,
	run,
}) => {
	// Get the original package.json content
	const originalPackageJsonString = await fs.readFile(
		resolve(packageDir, "package.json"),
		"utf-8"
	);
	const packageJson = JSON.parse(originalPackageJsonString) as PackageJson;

	packageJson.scripts ??= {};

	if (!answers.eslintRoot) {
		// Replace `root: true` with false in all eslintrc files
		const files = await globby(".eslintrc.*", { cwd: packageDir });
		for (const file of files) {
			const eslintrcString = await fs.readFile(file, "utf-8");
			const rootTrueRegex = /^(\s*)("?)root(\2):\s*true(,?\s*)$/;
			// Only replace first one, is prob the only one
			const rootFalseString = eslintrcString.replace(
				rootTrueRegex,
				"$1root: false$3"
			);
			await fs.writeFile(file, rootFalseString, "utf-8");
		}
	}
	if (answers.useJest) initJest({ packageJson, installNpmPackage });
	else removeJest({ packageDir });

	// Sort the package.json
	const sortedPackageJson = sortPackageJson(packageJson);

	// Stringify, tab indented
	const packageJsonString = JSON.stringify(sortedPackageJson, null, "\t");
	// Write the package.json
	await fs.writeFile("package.json", packageJsonString);
	await run("npm update --save");

	createGithubRepo({ answers, run });
};
