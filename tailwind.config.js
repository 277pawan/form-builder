/** @type {import('tailwindcss').Config} */
const colorPattern =
  /^(bg|text|border|hover:bg|hover:text|hover:border|focus:border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(-(50|100|200|300|400|500|600|700|800|900|950))?$/;

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    { pattern: colorPattern },
    { pattern: /^(bg|text|border)-(black|white|transparent|current)$/ },
    { pattern: /^border-(0|2|4|8|dashed|dotted|solid)$/ },
    "border-1",
    { pattern: /^rounded(-(none|sm|md|lg|xl|2xl|3xl|full))?$/ },
    {
      pattern:
        /^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap)-(\d+(\.\d+)?|\[.+\])$/,
    },
    { pattern: /^shadow(-(sm|md|lg|xl|2xl|none))?$/ },
    {
      pattern:
        /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|center|left|right|justify)$/,
    },
    {
      pattern:
        /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
    },
    {
      pattern:
        /^max-w-(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|full|screen)$/,
    },
    { pattern: /^opacity-(\d+)$/ },
    { pattern: /^cursor-(pointer|not-allowed)$/ },
    { pattern: /^flex(-(col|row|wrap|1|shrink-0))?$/ },
    { pattern: /^items-(start|center|end)$/ },
    { pattern: /^justify-(start|center|end|between)$/ },
    "fixed",
    "inset-0",
    "z-50",
    "bg-black/40",
    "backdrop-blur-sm",
  ],
  theme: {
    extend: {
      colors: {
        "custom-gradient": {
          start: "#3c153c",
          middle: "#030712",
          end: "#030712",
        },
      },
    },
  },
  plugins: [],
};
