/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Configure the content for all your files
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {},
    },
    plugins: [],
};
