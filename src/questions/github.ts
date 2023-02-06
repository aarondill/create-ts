export { githubQuestion };

// Types
import type { Option } from "create-create-app";
// Dependencies
import hasbin from "hasbin";

const hasGithubCLIinstalled = hasbin.sync("gh");
const githubQuestion: Option | Record<PropertyKey, never> =
	hasGithubCLIinstalled
		? {
				githubVisibility: {
					prompt: "if-no-arg",
					type: "list",
					choices: ["Public", "Private", "Internal", "None"],
					describe: "Create a repo using GH?",
				},
		  }
		: {};
