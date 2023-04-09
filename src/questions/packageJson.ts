export { typeModule };

import type { Option } from "create-create-app";

const typeModule: Readonly<Option["typeModule"]> = {
	type: "confirm",
	describe: "set `type: module` to use ES modules?",
	prompt: "if-no-arg",
	default: true,
} as const;
