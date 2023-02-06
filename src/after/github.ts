export { createGithubRepo };

// Types
import assert from "assert";
import type { AfterHookOptions } from "create-create-app";

async function createGithubRepo({
	answers: { githubVisibility, name },
	run,
}: Pick<AfterHookOptions, "answers" | "run">) {
	if (
		githubVisibility !== "Public" &&
		githubVisibility !== "Private" &&
		githubVisibility !== "Internal" &&
		githubVisibility !== "None"
	) {
		throw new TypeError("Something went wrong with githubVisibility");
	}

	const shouldCreateGHRepo = githubVisibility.toLowerCase() !== "none";
	if (!shouldCreateGHRepo) return;

	const repoVisibility = githubVisibility.toLowerCase();
	console.log("\nCreating a new github repository");
	try {
		await run(`gh repo create "${name}" --${repoVisibility} -r origin -s .`, {
			// Allows interactive mode
			stdio: "inherit",
		});
	} catch (e) {
		if (!(e instanceof Error)) e = Error(String(e));
		assert(e instanceof Error);
		console.error(
			"Oh No! Something went wrong creating your github repository!\n" +
				e.message
		);
	}
}
