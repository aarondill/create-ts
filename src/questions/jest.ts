export { useJest };
const useJest = {
	type: "confirm",
	describe: "Use Jest for testing?",
	prompt: "if-no-arg",
} as const;
