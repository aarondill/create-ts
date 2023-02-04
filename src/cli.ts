#!/usr/bin/env node
// Types
import type { Option, Options } from "create-create-app";
import type { PackageJson } from "type-fest";
// Built-ins
import fs from "fs/promises";
import { resolve } from "path";
import { fileURLToPath } from "url";
// Dependencies
import { create } from "create-create-app";
import { globby } from "globby";
import hasbin from "hasbin";
import sortPackageJson from "sort-package-json";
import { dedent } from "ts-dedent";

const templateRoot = new URL("../templates", import.meta.url);

const after: Options["after"] = async ({
	answers,
	installNpmPackage,
	packageDir,
	run,
}) => {
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
		const files = await globby(["jest.config", "jest.config.*"], {
			cwd: packageDir,
		});
		for (const file of files) await fs.rm(file);
		fs.rm("tests", { recursive: true });
	}

	// Sort the package.json
	const sortedPackageJson = sortPackageJson(packageJson);

	// Stringify, tab indented
	const packageJsonString = JSON.stringify(sortedPackageJson, null, "\t");
	// Write the package.json
	await fs.writeFile("package.json", packageJsonString);
	await run("npm update --save");

	// Will be undefined if gh isn't installed
	const { githubVisibility } = answers;
	const shouldCreateGHRepo =
		typeof githubVisibility === "string" &&
		githubVisibility.toLowerCase() !== "none";

	if (shouldCreateGHRepo) {
		const repoVisibility = githubVisibility.toLowerCase();
		const { name } = answers;
		await run(
			`gh repo create "${name}" --${repoVisibility} -r origin -s . --push`,
			{
				// Allows interactive mode
				stdio: "inherit",
			}
		);
	}
};

const hasGithubCLIinstalled = hasbin.sync("gh");
const createGithubQuestion: Option = {
	githubVisibility: {
		prompt: "always",
		type: "list",
		choices: ["Public", "Private", "Internal", "None"],
		describe: "Create a repo interactively using GH?",
	},
};

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
		// GH Repo if installed
		...(hasGithubCLIinstalled ? createGithubQuestion : {}),
	},
	after,

	caveat: ({ answers }) => dedent`
	Created ${answers.name} in CWD
	${answers.useJest ? "Run `npm test` to run jest" : ""}
	Run \`npm run lint\` to run eslint and prettier
	Run \`npm run build\` to compile to JS
	Run \`npm run watch\` to compile whenever changes are made
	Run \`npm run release\` or \`npx release-it\` to publish and release a new version

	`,
});
