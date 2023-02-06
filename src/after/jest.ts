export { initJest, removeJest };
// Types
import type { AfterHookOptions } from "create-create-app";
import type { PackageJson } from "type-fest";
// Built-ins
import fs from "fs/promises";
// Dependencies
import { globby } from "globby";

interface InitJestArguments {
	packageJson: PackageJson;
	installNpmPackage: AfterHookOptions["installNpmPackage"];
}
async function initJest({ packageJson, installNpmPackage }: InitJestArguments) {
	// Wants to use Jest
	console.log("\nInstalling jest");
	// Typescript needs the others
	await installNpmPackage(["jest", "@types/jest", "ts-jest"], true);

	packageJson.scripts ??= {};
	packageJson.scripts.test = "jest";
}

async function removeJest({
	packageDir,
}: Pick<AfterHookOptions, "packageDir">) {
	// Don't want jest
	const files = await globby(["jest.config", "jest.config.*"], {
		cwd: packageDir,
	});
	for (const file of files) await fs.rm(file);
	fs.rm("tests", { recursive: true });
}
