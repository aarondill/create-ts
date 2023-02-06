export { eslintRoot };

import { Option } from "create-create-app";

const eslintRoot: Option["eslintRoot"] = {
	type: "confirm",
	describe: "Use eslint config as root?",
	prompt: "if-no-arg",
} as const;
