export { githubVisibility };

// Types
import type { Option } from "create-create-app";
// Dependencies
import hasbin from "hasbin";

const hasGithubCLIinstalled = hasbin.sync("gh");
const githubVisibility: Readonly<Option["githubVisibility"]> = {
	prompt: hasGithubCLIinstalled ? "if-empty" : "never",
	type: "list",
	choices: ["Public", "Private", "Internal", "None"],
	describe: "Create a repo using GH?",
};
