/** @type {import('tailwindcss').Config} */
module.exports = {
	important: true,
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {
			backgroundColor: {
				primary: '#4f46e5'
			},
			textColor: {
				primary: '#4f46e5'
			},
			borderColor: {
				primary: '#4f46e5'
			}
		}
	},
	plugins: []
}
