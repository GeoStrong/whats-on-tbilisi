module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern:
        /bg-(blue|purple|indigo|orange|teal|gray|pink|red|green|yellow)-(100|200|500|600|700)/,
    },
    {
      pattern:
        /border-(blue|purple|indigo|orange|teal|gray|pink|red|green|yellow)-(100|200|500|600|700)/,
    },
    {
      pattern:
        /text-(blue|purple|indigo|orange|teal|gray|pink|red|green|yellow)-(100|200|500|600|700)/,
    },
  ],
  plugins: [],
};