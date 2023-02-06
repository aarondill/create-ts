export { setEslintRootFalse };
// Types
import type { AfterHookOptions } from "create-create-app";
// Built-ins
import fs from "fs/promises";
// Dependencies
import { globby } from "globby";

async function setEslintRootFalse({
	packageDir,
}: Pick<AfterHookOptions, "packageDir">) {
	// Replace `root: true` with false in all eslintrc files
	const files = await globby(".eslintrc.*", { cwd: packageDir, dot: true });
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
