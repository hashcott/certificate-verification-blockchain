module.exports = {
	mode: "jit",
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: "1rem",
				sm: "2rem",
				lg: "4rem",
				xl: "5rem",
				"2xl": "6rem",
			},
		},
		extends: {
			fontFamily: {
				geomanist: ["geomanist", "Arial", "Helvetica", "sans-serif"],
			},
		},
		fontFamily: {
			sans: ["Roboto Mono", "monospace"],
			serif: ["Roboto Mono", "monospace"],
			mono: ["Roboto Mono", "monospace"],
		},
	},
	variants: {},
	plugins: [require("daisyui"), require("@tailwindcss/typography")],
	daisyui: {
		styled: true,
		themes: true,
		base: true,
		utils: true,
		logs: true,
		rtl: false,
		themes: ["light", "dark"],
	},
};
