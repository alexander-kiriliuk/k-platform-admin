module.exports = {
	env: {
		browser: true,
		node: true,
		es2021: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@angular-eslint/recommended",
		"plugin:@angular-eslint/template/process-inline-templates",
	],
	ignorePatterns: [
		// "**/*.html"
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: [
				".eslintrc.{js,cjs}",
			],
			parserOptions: {
				sourceType: "script",
			},
		},
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: [
		"@typescript-eslint",
		"html",
	],
	rules: {
		"@typescript-eslint/no-namespace": "off",
		indent: [
			"error",
			"tab",
		],
		"linebreak-style": [
			"error",
			"unix",
		],
		quotes: [
			"error",
			"double",
		],
		semi: [
			"error",
			"always",
		],
		"comma-dangle": [
			"error",
			"only-multiline",
		],
	},
};
