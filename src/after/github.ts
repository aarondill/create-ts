export { createGithubRepo };

// Types
import type { AfterHookOptions } from "create-create-app";
// Built-ins
import assert from "assert";
// Dependencies
import { execa } from "execa";

async function createGithubRepo({
	answers: { githubVisibility, name },
	packageDir,
}: Pick<AfterHookOptions, "answers" | "packageDir">) {
	if (!githubVisibility) return; // GH isn't installed
	const options = ["Public", "Private", "Internal", "None"];
	if (
		typeof githubVisibility !== "string" ||
		!options.includes(githubVisibility)
	) {
		throw new TypeError("Something went wrong with githubVisibility", {
			cause: { githubVisibility },
		});
	}

	const shouldCreateGHRepo = githubVisibility.toLowerCase() !== "none";
	if (!shouldCreateGHRepo) return;

	const repoVisibility = githubVisibility.toLowerCase();
	console.log("\nCreating a new github repository");
	try {
		await execa(
			"gh",
			[
				...`repo create --${repoVisibility}`.split(" "),
				...`--remote=origin --source=. --`.split(" "),
				`${name}`,
			],
			{
				stdio: "inherit",
				cwd: packageDir,
			}
		);
	} catch (e) {
		if (!(e instanceof Error)) e = Error(String(e));
		assert(e instanceof Error);
		console.error(
			"Oh No! Something went wrong creating your github repository!\n" +
				e.message
		);
	}
}
