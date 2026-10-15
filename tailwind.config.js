/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#efeee9",
      },
      fontFamily: {
        hn: ['"Helvetica Neue ME"', "Helvetica", "Arial", "sans-serif"],
        sans: ['"Helvetica Neue ME"', "Helvetica", "Arial", "sans-serif"],
        serif: ['"Helvetica Neue ME"', "Helvetica", "Arial", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 1.2s ease-out both",
        "rise-in": "riseIn 1.4s cubic-bezier(0.22, 1, 0.36, 1) 300ms both",
        "fade-up": "fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "line": "lineGrow 1.1s cubic-bezier(0.76, 0, 0.24, 1) 1200ms both",
        "marquee": "marqueeScroll 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(4vh) scale(1.03)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        lineGrow: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        marqueeScroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
    },
  },
  plugins: [],
}
