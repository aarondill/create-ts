#!/usr/bin/env node
// Built-ins
import { fileURLToPath } from "url";
// Dependencies
import { create } from "create-create-app";
import { dedent } from "ts-dedent";
// My code
import { after } from "./after/index.js";
import { githubQuestion, useJest } from "./questions/index.js";

const templateRoot = new URL("../templates", import.meta.url);
main();

function main(argv = process.argv.slice(2)) {
	if (!argv[0]) {
		// No first argument, or is empty
		console.error(dedent`
	usage: create-ts <name>
	try create-ts --help for more information
	`);
		process.exitCode = 2;
		return;
	}

	create("create-ts", {
		templateRoot: fileURLToPath(templateRoot),
		promptForTemplate: true,
		extra: {
			useJest,
			eslintRoot: {
				type: "confirm",
				describe:
					"Use included eslint config as root? (not using it could cause problems)",
				prompt: "if-no-arg",
			},
			// GH Repo if installed
			...githubQuestion,
		},
		after,

		caveat: ({ answers }) => dedent`
	
	${answers.useJest ? "Run `npm test` to run jest" : ""}
	Run \`npm run lint\` to run eslint and prettier
	Run \`npm run build\` to compile to JS
	Run \`npm run watch\` to compile whenever changes are made
	Run \`npm run release\` or \`npx release-it\` to publish and release a new version
	`,
	});
}
