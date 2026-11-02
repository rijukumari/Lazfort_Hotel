/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#101722',
          light: '#1B2432',
          dark: '#0A0F17',
          50: '#F0F3F7',
          100: '#D9E0EB',
          200: '#B3C1D6',
          700: '#1B2432',
          800: '#101722',
          900: '#0B0F15',
        },
        secondary: {
          DEFAULT: '#1B2432',
          light: '#2B374A',
          dark: '#131B26',
        },
        accent: {
          DEFAULT: '#C6A66B',
          light: '#D4BB89',
          hover: '#B59458',
          dark: '#9E7E44',
          50: '#FAF7F0',
          100: '#F4EEDF',
          500: '#C6A66B',
          600: '#B59458',
        },
        ivory: {
          DEFAULT: '#F7F5F0',
          dark: '#EFECE4',
          light: '#FDFAF5',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#151D28',
          card: '#1B2432',
        },
        charcoal: {
          DEFAULT: '#252A34',
          muted: '#747B87',
          light: '#3C4250',
        },
        border: {
          DEFAULT: '#E5E1D8',
          dark: '#2A3444',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 4px 20px -2px rgba(198, 166, 107, 0.25)',
        'luxury': '0 10px 30px -5px rgba(16, 23, 34, 0.08), 0 4px 10px -2px rgba(16, 23, 34, 0.04)',
        'luxury-dark': '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 4px 10px -2px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
