#!/usr/bin/env node

import { create } from "create-create-app";
import fs from "fs/promises";
import { globby } from "globby";
import { resolve } from "path";

const templateRoot = resolve(__dirname, "..", "templates");

const caveat = `Happy Coding!`;

// See https://github.com/uetchy/create-create-app/blob/master/README.md for other options.

create("create-ts", {
	templateRoot: templateRoot,
	promptForTemplate: true,
	promptForPackageManager: true,
	defaultPackageManager: "npm",
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
	},
	after: async ({ answers, installNpmPackage }) => {
		console.log(answers);
		if (!answers.eslintRoot) {
			// Change the eslint thingy here
			/* 			# User doesn't want as root
	# Replace first root: true with root: false for first instance
	sed -si'' '0,/root: true,/s//root: false,/' .eslintrc.* */
		}
		if (answers.useJest) {
			// Want to use Jest
			console.log("Installing jest");
			await installNpmPackage("jest");
			/* await fs.mkdir("test");
			const defaultTest =
				`describe("something", () => {` +
				`	it("does something", () => {` +
				`		expect(true).toBe(true);` +
				`	});` +
				`})`;
			await fs.writeFile(resolve("test", "index.test.ts"), defaultTest, {
				encoding: "utf-8",
			}); */
		} else {
			// Don't want jest
			const files = await globby(["jest.config", "jest.config.*"]);
			for (const file of files) await fs.rm(file);
			fs.rm("tests", { recursive: true });
		}
	},
	caveat,
});
