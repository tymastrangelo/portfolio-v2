/** @type {import('tailwindcss').Config} */
module.exports = {
  // hover: utilities only apply where a pointer can hover, so a tapped
  // control does not stay in its hover state on a phone
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // The palette is defined once, here. globals.css copies it onto :root with
  // theme() so plain CSS (app/site.css) reads the same values as utilities.
  theme: {
    extend: {
      fontFamily: {
        // SF Pro on Apple devices, Inter Tight everywhere else (globals.css)
        sans: ['var(--font-sans)'],
      },
      colors: {
        // Apple black: true black and graphite like iOS dark mode, Apple's
        // off-white for text. His photos carry the color; the three accents
        // are for small things only.
        night: '#000000',
        deep: '#1c1c1e',
        shore: '#2c2c2e',
        white: '#f5f5f7',
        mist: 'rgba(245, 245, 247, 0.64)',
        line: 'rgba(255, 255, 255, 0.1)',
        sun: '#f2a65a', // sunrise on Acatenango: things you can hold
        rose: '#ec7f6d', // a Gulf sunset: just for fun
        sea: '#5cbcb2', // the water off Marco: software
      },
    },
  },
  plugins: [],
}
