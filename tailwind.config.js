module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#030303",
          brighter: "#1a1a1a",
          brightest: "#272728",
        },
        border: {
          DEFAULT: "#343536",
        },
        textColor: {
          lightGray: "#F1EFEE",
          primary: "#FAFAFA",
          secColor: "#efefef",
          navColor: "#BEBEBE",
        },
        backgroundColor: {
          mainColor: "#F90716",
          secondaryColor: "#F0F0F0",
          blackOverlay: "rgba(0, 0 ,0 ,0.7)",
        },
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "spin-slow-2": "spin 15s linear infinite",
        "bounce-slow": "bounce 6s linear infinite",
        "bounce-slow-2": "bounce 15s linear infinite",
        "ping-slow": "ping 15s linear infinite",
        "pulse-slow": "pulse 6s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
