export { eslintRoot, eslintOpinionated };

import { Option } from "create-create-app";

const eslintRoot: Option["eslintRoot"] = {
	type: "confirm",
	describe: "Use eslint config as root?",
	prompt: "if-no-arg",
	default: true,
} as const;

const eslintOpinionated: Option["eslintOpinionated"] = {
	type: "list" as const,
	describe: "Use a (heavily) opinionated eslint configuration?" as const,
	choices: ["opinionated", "base"] as ["opinionated", "base"],
	default: "opinionated" as const,
	prompt: "if-no-arg",
};
