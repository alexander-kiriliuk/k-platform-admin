/** @type {import('tailwindcss').Config} */
module.exports = {
	prefix: "",
	content: [
		"./src/**/*.{html,ts}",
	],
	theme: {
		extend: {},
	},
	plugins: [
		require("postcss-import"),
		require("autoprefixer"),
		require("tailwindcss-animated")
	],
};
