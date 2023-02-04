#!/usr/bin/env node

import { create } from "create-create-app";
import fs from "fs/promises";
import { globby } from "globby";
import { resolve } from "path";
import sortPackageJson from "sort-package-json";
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
			describe: "Use included eslint config as root?",
			prompt: "always",
		},
		// GH Repo??
	},
	after: async ({ answers, installNpmPackage, run, packageDir }) => {
		console.log(packageDir);
		// Get the original package.json content
		const originalPackageJsonString = await fs.readFile(
			resolve(packageDir, "package.json"),
			"utf-8"
		);
		const packageJson = JSON.parse(originalPackageJsonString) as PackageJson;

		packageJson.scripts ??= {};

		console.log(answers);
		if (!answers.eslintRoot) {
			// Change the eslint thingy here
			//! bash code:
			/* 			# User doesn't want as root
	# Replace first root: true with root: false for first instance
	sed -si'' '0,/root: true,/s//root: false,/' .eslintrc.* */
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
	},

	caveat: ({ answers }) => `
	Created ${answers.name}

	${answers.useJest ? "Run `npm test` to run jest" : ""}
	Run \`npm run lint\` to run eslint
	Run \`npm run build\` to compile to JS
	Run \`npm run watch\` to compile whenever changes are made
	Run \`npm run release\` or \`npx release-it\` to publish and release a new version
	`,
});
