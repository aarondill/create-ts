export {
	setEslintRoot,
	moveChosenEslintrc,
	setJestOverrideEslint,
	setEslintEnvironments,
};
// Types
import type { AfterHookOptions } from "create-create-app";
// Built-ins
import fs from "fs/promises";
// Dependencies
import { globby } from "globby";
import path from "path";
import type { PackageJson } from "type-fest";
import { eslintSupportedNativeEnvironments } from "../questions/eslint.js";

const whitespace = "[^\\S\\r\\n]";
/** The value to prepend to a RegExp constructor to find marker comments */
const commentMarkerPattern = `(?:^|${whitespace})*\\/\\/${whitespace}*! This is a comment marker which will be removed during creation\\.${whitespace}*(?:\\(.*\\))?${whitespace}*\\n`;

async function setEslintRoot({
	packageDir,
	answers,
}: Readonly<Pick<AfterHookOptions, "packageDir" | "answers">>) {
	// Replace `root: true` with false in eslintrc file
	const file = path.resolve(packageDir, ".eslintrc.cjs");

	const eslintrcString = await fs.readFile(file, "utf-8");

	// gets both true and false values
	const isRootRegex = new RegExp(
		commentMarkerPattern +
			`(${whitespace}*)const isRoot${whitespace}*=${whitespace}*.{4,5}(;?${whitespace}*\\n)`
	);

	const choice = !!answers.eslintRoot;

	const isRootFalseString = eslintrcString.replace(
		isRootRegex,
		`$1const isRoot = ${String(choice)}$2`
	);
	await fs.writeFile(file, isRootFalseString, "utf-8");
}

async function setJestOverrideEslint({
	packageDir,
	answers: { template },
}: Readonly<Pick<AfterHookOptions, "packageDir" | "answers">>) {
	const commentAndOverridesMarker = new RegExp(
		commentMarkerPattern +
			`(\\s*)overrides:\\s*\\[((?:.|\\s)*)\\]${whitespace}*(,?${whitespace}*\\n?)`
	);

	const file = path.resolve(packageDir, ".eslintrc.cjs");

	const eslintrcString = await fs.readFile(file, "utf-8");

	const matches = commentAndOverridesMarker.exec(eslintrcString);
	const arrayContent = matches?.[2] ? `${matches?.[2]}` : "";
	const maybeComma =
		arrayContent.trim().length > 0 && !arrayContent.trimEnd().endsWith(",")
			? ","
			: "";

	const overrideInsert = template === "with-jest" ? `jestOverride` : "";

	const newOverrides = eslintrcString.replace(
		commentAndOverridesMarker,
		`$1overrides: [${arrayContent}${maybeComma}${overrideInsert}]$3`
	);
	await fs.writeFile(file, newOverrides, "utf-8");
}

async function setEslintEnvironments({
	answers,
	packageDir,
}: Readonly<Pick<AfterHookOptions, "packageDir" | "answers">>) {
	// Replace Environments object with desired values
	const commentAndEnv = new RegExp(
		commentMarkerPattern +
			`(\\s*)env:\\s*({(?:.|\\s)*?})${whitespace}*(,?${whitespace}*\\n?)`
	);

	const file = path.resolve(packageDir, ".eslintrc.cjs");
	const eslintrcString = await fs.readFile(file, "utf-8");

	const matches = commentAndEnv.exec(eslintrcString);
	const prevString = matches?.[2] ? `${matches?.[2]}` : "{}";

	// eslint-disable-next-line no-eval
	let objectJSON = eval(`(${prevString})`) as Record<string, boolean>;
	// If not object, make it one.
	if (typeof objectJSON !== "object" || Array.isArray(objectJSON)) {
		objectJSON = {};
	}
	// Remove if already there
	for (const choice of eslintSupportedNativeEnvironments) {
		delete objectJSON[choice];
	}
	for (const answer of answers.eslintEnvironments as string[]) {
		objectJSON[answer] = true;
	}

	const newEnv = eslintrcString.replace(
		commentAndEnv,
		`$1env: ${JSON.stringify(objectJSON, null, 4)}$3`
	);
	await fs.writeFile(file, newEnv, "utf-8");
}

async function moveChosenEslintrc({
	answers,
	packageDir,
	packageJson,
}: Readonly<
	Pick<AfterHookOptions, "answers" | "packageDir"> & {
		packageJson: PackageJson;
	}
>) {
	const { eslintOpinionated: chosenName } = answers;
	if (typeof chosenName !== "string") {
		throw new TypeError("Expected string, received " + typeof chosenName);
	}
	// Only find on first level
	const eslintrcFiles = await globby("eslintrc-*.cjs", {
		deep: 0,
		cwd: packageDir,
		dot: true,
		absolute: true,
	});

	const fileFinderRegex = new RegExp("^.+/eslintrc-" + chosenName + ".cjs$");
	const chosenFile = eslintrcFiles.find(
		file => file.match(fileFinderRegex) !== null
	);

	if (!chosenFile) {
		throw new Error(`Could not find eslintrc-${chosenName}.cjs file`);
	}

	const otherFiles = eslintrcFiles.filter(f => f !== chosenFile);
	// Wait for all files to delete, async
	await Promise.allSettled(
		otherFiles.map(file => fs.rm(file, { force: true }))
	);

	const destination = path.resolve(packageDir, ".eslintrc.cjs");
	await fs.rename(chosenFile, destination);
}
