export {
	eslintRoot,
	eslintOpinionated,
	eslintEnvironments,
	eslintSupportedNativeEnvironments,
};

import type { Option } from "create-create-app";

const eslintRoot: Readonly<Option["eslintRoot"]> = {
	type: "confirm",
	describe: "Use eslint config as root?",
	prompt: "if-no-arg",
	default: true,
} as const;

const eslintOpinionated: Readonly<Option["eslintOpinionated"]> = {
	type: "list" as const,
	describe: "Use a (heavily) opinionated eslint configuration?" as const,
	choices: ["opinionated", "base"] as ["opinionated", "base"],
	default: "opinionated" as const,
	prompt: "if-no-arg",
};

const eslintSupportedNativeEnvironments = [
	"browser",
	"node",
	"commonjs",
	"shared-node-browser",
	"es6",
	"es2016",
	"es2017",
	"es2018",
	"es2019",
	"es2020",
	"es2021",
	"es2022",
	"worker",
	"amd",
	"mocha",
	"jasmine",
	"jest",
	"phantomjs",
	"protractor",
	"qunit",
	"jquery",
	"prototypejs",
	"shelljs",
	"meteor",
	"mongo",
	"applescript",
	"nashorn",
	"serviceworker",
	"atomtest",
	"embertest",
	"webextensions",
	"greasemonkey",
];

const eslintEnvironments: Readonly<Option["eslintEnvironments"]> = {
	describe: "which environments would you like ESLint to lint for?",
	type: "checkbox",
	choices: eslintSupportedNativeEnvironments,
	default: ["node"],
	prompt: "if-no-arg",
};
