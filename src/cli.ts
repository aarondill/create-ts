#!/usr/bin/env node

import { create } from "create-create-app";
import { resolve } from "path";

const templateRoot = resolve(__dirname, "..", "templates");

const caveat = `Happy Coding!`;

// See https://github.com/uetchy/create-create-app/blob/master/README.md for other options.

create("create-ts", {
	templateRoot,
	defaultPackageManager: "npm",
	extra: {
		useJest: {
			type: "confirm",
			describe: "Use Jest for testing?",
			prompt: "always",
		},
	},
	after: ({ answers, installNpmPackage }) => {
		if (answers.useJest) {
			console.log("Installing jest");
			installNpmPackage("jest");
		}
	},
	caveat,
});
