export { setEslintRootFalse, moveChosenEslintrc, setJestOverrideEslint };
// Types
import type { AfterHookOptions } from "create-create-app";
// Built-ins
import fs from "fs/promises";
// Dependencies
import { globby } from "globby";
import path from "path";

const whitespace = "[^\\S\\r\\n]";
/** The value to prepend to a RegExp constructor to find marker comments */
const commentMarkerPattern = `(?:^|${whitespace})*\\/\\/${whitespace}*! This is a comment marker which will be removed during creation\\.${whitespace}*\\n`;

async function setEslintRootFalse({
	packageDir,
	answers,
}: Pick<AfterHookOptions, "packageDir" | "answers">) {
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
		`$1const isRoot = ${choice}$2`
	);
	await fs.writeFile(file, isRootFalseString, "utf-8");
}

async function setJestOverrideEslint({
	packageDir,
	answers: { template },
}: Pick<AfterHookOptions, "packageDir" | "answers">) {
	const commentAndOverridesMarker = new RegExp(
		commentMarkerPattern +
			`(\\s*)overrides:\\s*\\[((?:.|\\s)*)\\]${whitespace}*(,?${whitespace}*\\n?)`
	);

	const file = path.resolve(packageDir, ".eslintrc.cjs");

	const eslintrcString = await fs.readFile(file, "utf-8");

	const matches = commentAndOverridesMarker.exec(eslintrcString);
	const prev = matches?.[2] ? `${matches?.[2]}` : "";
	const maybeComma =
		prev.trim().length > 0 && !prev.trimEnd().endsWith(",") ? "," : "";

	const overrideInsert = template === "with-jest" ? `jestOverride` : "";

	console.log("Prev: " + prev);
	console.log("To Insert: " + overrideInsert);

	const newOverrides = eslintrcString.replace(
		commentAndOverridesMarker,
		`$1overrides: [${prev}${maybeComma}${overrideInsert}]$3`
	);
	await fs.writeFile(file, newOverrides, "utf-8");
}

async function moveChosenEslintrc({
	answers,
	packageDir,
}: Pick<AfterHookOptions, "answers" | "packageDir">) {
	if (answers.eslintOpinionated) {
		const chosenName = answers.eslintOpinionated as string;
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
}
