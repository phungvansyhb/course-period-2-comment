const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				'primary-blue': '#5457B6',
				'primary-soft-red': '#ED6468',
				'primary-light-blue': '#C3C4EF',
				'primary-red': '#FFB8BB',
				'neutral-blue': '#324152',
				'neutral-grayish-blue': '#67727E',
				'neutral-light-gray': '#EAECF1',
				'neutral-very-light-gray': '#F5F6FA',
			},
			fontFamily: {
				rubik: ['Rubik', 'sans-serif'],
			},
		},
	},
	// darkMode: 'class',
	plugins: [nextui()],
};
