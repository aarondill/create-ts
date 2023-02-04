#!/usr/bin/env node

import { create } from "create-create-app";
import fs from "fs/promises";
import { globby } from "globby";
import { resolve } from "path";
import sortPackageJson from "sort-package-json";
import { dedent } from "ts-dedent";
import type { PackageJson } from "type-fest";
import { fileURLToPath } from "url";

const templateRoot = new URL("../templates", import.meta.url);

// See https://github.com/uetchy/create-create-app/blob/master/README.md for other options.

create("create-ts", {
	templateRoot: fileURLToPath(templateRoot),
	promptForTemplate: true,
	promptForPackageManager: true,
	extra: {
		useJest: {
			type: "confirm",
			describe: "Use Jest for testing?",
			prompt: "always",
		},
		eslintRoot: {
			type: "confirm",
			describe:
				"Use included eslint config as root? (not using it could cause problems)",
			prompt: "always",
		},
		// GH Repo??
	},
	after: async ({ answers, installNpmPackage, packageDir, run }) => {
		console.log(packageDir);
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
		if (answers.useJest) {
			// Wants to use Jest
			console.log("Installing jest");
			// Typescript needs these.
			await installNpmPackage(["jest", "@types/jest", "ts-jest"], true);

			packageJson.scripts.test = "jest";
		} else {
			// Don't want jest
			const files = await globby(["jest.config", "jest.config.*"]);
			for (const file of files) await fs.rm(file);
			fs.rm("tests", { recursive: true });
		}

		// Sort the package.json
		const sortedPackageJson = sortPackageJson(packageJson);

		// Stringify, tab separated
		const packageJsonString = JSON.stringify(sortedPackageJson, null, "\t");
		// Write the package.json
		await fs.writeFile("package.json", packageJsonString);
		await run("npm update --save");
	},

	caveat: ({ answers }) => dedent`
	Created ${answers.name} in CWD
	${answers.useJest ? "Run `npm test` to run jest" : ""}
	Run \`npm run lint\` to run eslint and prettier
	Run \`npm run build\` to compile to JS
	Run \`npm run watch\` to compile whenever changes are made
	Run \`npm run release\` or \`npx release-it\` to publish and release a new version

	`,
});
