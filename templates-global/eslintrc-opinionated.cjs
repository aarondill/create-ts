// this is the opinionated eslint configuration
/** @typedef {import("@typescript-eslint/utils/dist/ts-eslint/Linter.d").Linter.Config} EslintConfig */
/** @typedef {import("@typescript-eslint/utils/dist/ts-eslint/Linter.d").Linter.Config["ignorePatterns"]} EslintIgnorePatterns */
/** @typedef {import("@typescript-eslint/utils/dist/ts-eslint/Linter.d").Linter.RulesRecord} EslintRules */
/** @typedef {import("@typescript-eslint/utils/dist/ts-eslint/Linter.d").Linter.ConfigOverride} ConfigOverride */

/** @type {boolean} */
//! This is a comment marker which will be removed during creation.
const isRoot = true;

/** @type EslintIgnorePatterns */
const ignorePatterns = ["dist", "**/*.d.ts", "node_modules"];

/**
 * This is the Override to support Jest for the tests directory. If not using
 * jest, feel free to remove it.
 * @type ConfigOverride
 */
const jestOverride = {
	// Jest Stuff! only applies to files in tests folder
	files: ["tests/**"],
	plugins: ["jest"],
	env: {
		"jest/globals": true,
	},
	rules: {
		// See documentation at https://www.npmjs.com/package/eslint-plugin-jest#rules
		"jest/consistent-test-it": "error",
		"jest/no-deprecated-functions": "error",
		"jest/no-done-callback": "warn",
		"jest/no-export": "warn",
		"jest/no-identical-title": "warn",
		"jest/no-standalone-expect": "error",
		"jest/valid-describe-callback": "error",
		"jest/valid-expect": "error",
		"jest/valid-expect-in-promise": "error",
		"jest/valid-title": "warn",
	},
};

/** @type EslintRules */
const jsRules = {
	// See documentation at https://eslint.org/docs/latest/rules/

	eqeqeq: "warn",
	"no-cond-assign": "warn",
	"no-const-assign": "error",
	"no-constant-condition": "warn",
	"no-else-return": "warn",
	"no-eval": "warn",
	"no-extra-bind": "warn",
	"no-extra-label": "warn",
	"no-fallthrough": "warn",
	"no-label-var": "error",
	"no-lone-blocks": "warn",
	"no-lonely-if": "warn",
	"no-negated-condition": "warn",
	"no-self-compare": "warn",
	"no-sparse-arrays": "warn",
	"no-unmodified-loop-condition": "warn",
	"no-unneeded-ternary": [
		"warn",
		{
			defaultAssignment: false,
		},
	],
	"no-unreachable-loop": "warn",
	"no-useless-computed-key": "warn",
	"no-useless-concat": "warn",
	"no-useless-escape": "warn",
	"no-var": "warn",
	"no-with": "warn",
	"operator-assignment": "warn",
	"prefer-const": "warn",
	"prefer-exponentiation-operator": "warn",
	"prefer-regex-literals": [
		"warn",
		{
			disallowRedundantWrapping: true,
		},
	],
	"use-isnan": [
		"error",
		{
			enforceForIndexOf: true,
		},
	],
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

	"@typescript-eslint/adjacent-overload-signatures": "error",
	"@typescript-eslint/array-type": [
		"warn",
		{
			default: "array",
		},
	],
	"@typescript-eslint/ban-ts-comment": [
		"error",
		{
			"ts-nocheck": "allow-with-description",
		},
	],
	"@typescript-eslint/ban-types": "error",
	"@typescript-eslint/consistent-type-imports": [
		"warn",
		{
			disallowTypeAnnotations: false,
			fixStyle: "separate-type-imports",
			prefer: "type-imports",
		},
	],
	"@typescript-eslint/dot-notation": "warn",
	"@typescript-eslint/naming-convention": [
		"warn",
		{
			format: null,
			leadingUnderscore: "allow",
			modifiers: ["requiresQuotes"],
			// Allow any format for quoted properties
			selector: "property",
			trailingUnderscore: "allow",
		},
		{
			format: ["camelCase", "UPPER_CASE"],
			leadingUnderscore: "allow",
			// Allow camelCase or upper_case for non-quoted properties
			selector: "property",
			trailingUnderscore: "allow",
		},
		{
			format: ["PascalCase"],
			// Force PascalCase for types and typeLikes
			selector: "typeLike",
		},
		{
			format: ["PascalCase"],
			leadingUnderscore: "allow",
			modifiers: ["unused"],
			// Allow leading Underscores for *unused* types and typeLikes
			selector: "typeLike",
		},
		{
			format: ["camelCase", "UPPER_CASE"],
			leadingUnderscore: "allow",
			// Allow variables to be camelCase or CONSTANT and _underscores_
			selector: "variable",
			trailingUnderscore: "allow",
		},
		{
			format: ["camelCase"],
			leadingUnderscore: "allow",
			// Allow underscores on either side of camelCased defaults
			selector: "default",
			trailingUnderscore: "allow",
		},
	],
	"@typescript-eslint/no-confusing-non-null-assertion": "warn",
	"@typescript-eslint/no-empty-interface": "warn",
	"@typescript-eslint/no-extra-non-null-assertion": "error",
	"@typescript-eslint/no-invalid-void-type": "error",
	"@typescript-eslint/no-loop-func": "error",
	"@typescript-eslint/no-misused-new": "error",
	"@typescript-eslint/no-non-null-asserted-nullish-coalescing": "warn",
	"@typescript-eslint/no-non-null-asserted-optional-chain": "error",
	"@typescript-eslint/no-redeclare": [
		"error",
		{
			ignoreDeclarationMerge: true,
		},
	],
	"@typescript-eslint/no-require-imports": "warn",
	"@typescript-eslint/no-throw-literal": "error",
	"@typescript-eslint/no-unnecessary-type-constraint": "warn",
	"@typescript-eslint/no-unsafe-declaration-merging": "warn",
	"@typescript-eslint/no-unused-expressions": [
		"warn",
		{
			allowShortCircuit: true,
			allowTernary: true,
		},
	],
	"@typescript-eslint/no-unused-vars": "warn",
	"@typescript-eslint/no-use-before-define": [
		"warn",
		{
			allowNamedExports: true,
			classes: true,
			functions: false,
			variables: true,
		},
	],
	"@typescript-eslint/no-useless-constructor": "warn",
	"@typescript-eslint/no-useless-empty-export": "warn",
	"@typescript-eslint/no-var-requires": "error",
	"@typescript-eslint/prefer-as-const": "error",
	"@typescript-eslint/prefer-enum-initializers": "warn",
	"@typescript-eslint/prefer-nullish-coalescing": [
		"warn",
		{
			ignoreTernaryTests: false,
		},
	],
	"@typescript-eslint/prefer-optional-chain": "warn",
	"@typescript-eslint/prefer-ts-expect-error": "error",
	"@typescript-eslint/return-await": ["warn", "always"],
	"@typescript-eslint/triple-slash-reference": "error",
	"@typescript-eslint/switch-exhaustiveness-check": "warn",
	"@typescript-eslint/unified-signatures": "warn",
	// From eslint-plugin-functional
	"functional/prefer-immutable-types": [
		"error",
		{
			enforcement: "ReadonlyShallow",
			ignoreInferredTypes: true,
			ignoreClasses: false,
			// Allow mutable, mutableValue, mut, or mutVal, and elements
			ignoreNamePattern: ["mut(able)?([A-Z].*)?", "HTML.*", "^elem(ent)?$"],
			// Allow Mutable, MutableType, Mut, MutType, as well as elements
			ignoreTypePattern: ["Mut(able)?([A-Z].*)?", "HTML.*", "^Element$"],

			variables: {
				ignoreInFunctions: true,
			},
			returnTypes: {
				enforcement: "None",
			},
		},
	],
};
/** @type EslintRules */
const extendsRulesOverrides = {
	"@typescript-eslint/no-misused-promises": [
		"error",
		{ checksVoidReturn: false },
	],
};

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
	// TODO, ask user:
	env: {
		node: true,
		browser: false,
	},
	plugins: ["@typescript-eslint", "compat", "functional"],
	extends: [
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:compat/recommended",
	],

	//! This is a comment marker which will be removed during creation.
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
