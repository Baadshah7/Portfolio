/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        slate900: '#0F172A',
        slate800: '#1E293B',
        slate700: '#334155',
        bluePrimary: '#3B82F6',
        textLight: '#F8FAFC',
        textMuted: '#94A3B8'
      }
    }
  },
  plugins: [],
}
