#!/usr/bin/env node
// Built-ins
import { fileURLToPath } from "url";
// Dependencies
import type { AfterHookOptions } from "create-create-app";
import { create } from "create-create-app";
import { dedent } from "ts-dedent";
// My code
import hasbin from "hasbin";
import { basename } from "path";
import { after } from "./after/index.js";
import {
	eslintEnvironments,
	eslintOpinionated,
	eslintRoot,
	githubVisibility,
} from "./questions/index.js";

function getDefaultPackageManager(): "pnpm" | "npm" | "yarn" | undefined {
	// get name from executable: /usr/local/bin/npm --> npm
	const defaultPackageManager = basename(process.env._ ?? "");

	// If called through a package manager
	if (["pnpm", "npm", "yarn"].includes(defaultPackageManager))
		return defaultPackageManager as "pnpm" | "npm" | "yarn";

	// Called through node or nodejs
	if (["nodejs", "node", "create-ts"].includes(defaultPackageManager)) {
		if (hasbin.sync("pnpm")) return "pnpm";
		else if (hasbin.sync("yarn")) return "yarn";
		return "npm";
	}
	// called another way, it's `create`'s problem now.
	return undefined;
}

async function main(argv = process.argv.slice(2)): Promise<void> {
	const templateRoot = new URL("../templates", import.meta.url);

	if (!argv[0]) {
		// No first argument, or is empty
		console.error(dedent`
	usage: create-ts <name>
	try create-ts --help for more information
	`);
		process.exitCode = 2;
		return;
	}

	await create("create-ts", {
		templateRoot: fileURLToPath(templateRoot),
		promptForTemplate: true,
		defaultTemplate: "without-jest",
		promptForPackageManager: true,
		defaultPackageManager: getDefaultPackageManager(),
		extra: {
			eslintOpinionated,
			eslintRoot,
			eslintEnvironments,
			// GH Repo if installed
			githubVisibility,
		},
		after,
		skipNpmInstall: true,
		caveat: ({ answers, packageManager }: Readonly<AfterHookOptions>) => dedent`
		
	${
		answers.template === "jest"
			? `Run \`${packageManager} test\` to run jest`
			: ""
	}
	Run \`${packageManager} run lint\` to run eslint and prettier
	Run \`${packageManager} run build\` to compile to JS
	Run \`${packageManager} run watch\` to compile whenever changes are made
	Run \`${packageManager} run release\` or \`npx release-it\` to publish and release a new version
	`,
	});
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
