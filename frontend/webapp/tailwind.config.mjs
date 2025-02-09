/** @type {import('tailwindcss').Config} */
const config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				blue: "#3d405b",
				red: "#e07a5f",
				white: "#f8f8f8",
				black: "#1a1a1a",
				background: "#f4f1de",
				foreground: "var(--foreground)",
			},
			fontFamily: {
				fraunces: ["Fraunces", "serif"],
				roboto: ["Roboto", "sans-serif"],
				italianno: ["Italianno", "serif"],
			},
		},
	},
	plugins: [],
};

export default config;