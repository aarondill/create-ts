// this is the lightest possible typescript-eslint configuration
/** @typedef {import("@typescript-eslint/utils/dist/ts-eslint/Config").ClassicConfig.Config} EslintConfig */
/** @typedef {import("@typescript-eslint/utils/dist/ts-eslint/Config").ClassicConfig.Config["ignorePatterns"]} EslintIgnorePatterns */
/** @typedef {import("@typescript-eslint/utils/dist/ts-eslint/Config").SharedConfig.RulesRecord} EslintRules */
/** @typedef {import("@typescript-eslint/utils/dist/ts-eslint/Config").ClassicConfig.ConfigOverride} ConfigOverride */

/** @type {boolean} */
//! This is a comment marker which will be removed during creation. (This must be constant. Don't change the name!)
const isRoot = true;

/** @type EslintIgnorePatterns */
const ignorePatterns = ["dist", "**/*.d.ts", "node_modules"];

/**
 * This is the Override to support Jest for the tests directory. If not using
 * jest, feel free to remove it.
 * @type ConfigOverride
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const jestOverride = {
	// Jest Stuff! only applies to files in tests folder
	files: ["tests/**"],
	plugins: ["jest"],
	env: {
		"jest/globals": true,
	},
	rules: {
		// See documentation at https://www.npmjs.com/package/eslint-plugin-jest#rules
	},
};

/** @type EslintRules */
const jsRules = {
	// See documentation at https://eslint.org/docs/latest/rules/
};

/** @type EslintRules */
const jsRuleOverrides = {
	"block-spacing": "off",
	"brace-style": "off",
	"comma-dangle": "off",
	"comma-spacing": "off",
	"default-param-last": "off",
	"dot-notation": "off",
	"func-call-spacing": "off",
	indent: "off",
	"init-declarations": "off",
	"key-spacing": "off",
	"keyword-spacing": "off",
	"lines-between-class-members": "off",
	"no-array-constructor": "off",
	"no-dupe-class-members": "off",
	"no-duplicate-imports": "off",
	"no-empty-function": "off",
	"no-extra-parens": "off",
	"no-extra-semi": "off",
	"no-implied-eval": "off",
	"no-invalid-this": "off",
	"no-loop-func": "off",
	"no-loss-of-precision": "off",
	"no-magic-numbers": "off",
	"no-redeclare": "off",
	"no-restricted-imports": "off",
	"no-shadow": "off",
	"no-throw-literal": "off",
	"no-unused-expressions": "off",
	"no-unused-vars": "off",
	"no-use-before-define": "off",
	"no-useless-constructor": "off",
	"object-curly-spacing": "off",
	"padding-line-between-statements": "off",
	quotes: "off",
	"require-await": "off",
	"return-await": "off",
	semi: "off",
	"space-before-blocks": "off",
	"space-before-function-paren": "off",
	"space-infix-ops": "off",
};

/** @type EslintRules */
const tsRules = {
	// See documentation at https://typescript-eslint.io/rules/
};
/** @type EslintRules */
const extendsRulesOverrides = {};

/** @type EslintConfig */
const config = {
	root: isRoot,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		impliedStrict: true,
		project: "./tsconfig.eslint.json",
	},
	//! This is a comment marker which will be removed during creation. (No variables inside this object!)
	env: {
		node: true,
		browser: false,
	},
	plugins: ["@typescript-eslint"],
	extends: ["plugin:@typescript-eslint/eslint-recommended"],

	//! This is a comment marker which will be removed during creation. (No comments allowed inside the array!)
	overrides: [],

	rules: {
		...jsRules,
		...jsRuleOverrides,
		...tsRules,
		...extendsRulesOverrides,
	},
	ignorePatterns,
};

module.exports = config;
