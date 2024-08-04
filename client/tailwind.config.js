/** @type {import('tailwindcss').Config} */
export default {
    variants: {
        colors: ["group-hover", "hover"],
    },
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
};
