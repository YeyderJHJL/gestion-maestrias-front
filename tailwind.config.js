

export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A2F5A',
          light: '#2E5FA3',
          dark: '#0B1A3B',
        },
        accent: {
          DEFAULT: '#7B1D2E',
          light: '#9E2A3F',
        },
        success: '#10B981',
        warning: '#F59E0B',
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F8F7F4',
        },
        border: '#E5E4E0',
        text: {
          DEFAULT: '#1A1A1A',
          muted: '#666666',
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Source Sans Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

