export { after };
// Types
import type { Options } from "create-create-app";
import type { PackageJson } from "type-fest";
// Built-ins
import fs from "fs/promises";
import { resolve } from "path";
// Dependencies
import sortPackageJson from "sort-package-json";
// My code
import { setEslintRootFalse } from "./eslint.js";
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

	if (!answers.eslintRoot) await setEslintRootFalse({ packageDir });

	if (answers.useJest) await initJest({ packageJson, installNpmPackage });
	else await removeJest({ packageDir });

	// Sort the package.json
	const sortedPackageJson = sortPackageJson(packageJson);

	// Stringify, tab indented
	const packageJsonString = JSON.stringify(sortedPackageJson, null, "\t");
	// Write the package.json
	await fs.writeFile("package.json", packageJsonString);
	await run("npm update --save");

	await createGithubRepo({ answers, run });
};
