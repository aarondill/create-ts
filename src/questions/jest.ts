export { useJest };

import { Option } from "create-create-app";

const useJest: Option["useJest"] = {
	type: "confirm",
	describe: "Use Jest for testing?",
	prompt: "if-no-arg",
} as const;
