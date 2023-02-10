export { initJest, removeJest };
// Types
import type { AfterHookOptions } from "create-create-app";
import type { PackageJson } from "type-fest";
// Built-ins
import fs from "fs/promises";
// Dependencies
import { globby } from "globby";
import path from "path";

interface InitJestArguments {
	packageJson: PackageJson;
	installNpmPackage: AfterHookOptions["installNpmPackage"];
}
async function initJest({ packageJson }: InitJestArguments) {
	// Wants to use Jest
	console.log("\nInstalling jest");

	packageJson.devDependencies ??= {};
	// These will be set by running npm update
	packageJson.devDependencies.jest = "*";
	// These are for TS
	packageJson.devDependencies["@types/jest"] = "*";
	packageJson.devDependencies["ts-jest"] = "*";

	packageJson.scripts ??= {};
	packageJson.scripts.test = "yarpm run lint && jest";
}

async function removeJest({
	packageDir,
}: Pick<AfterHookOptions, "packageDir">) {
	// Don't want jest
	const files = await globby(["jest.config", "jest.config.*"], {
		cwd: packageDir,
		absolute: true,
	});
	for (const file of files) await fs.rm(file);
	await fs.rm(path.resolve(packageDir, "tests"), { recursive: true });
}
