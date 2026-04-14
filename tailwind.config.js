/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vy: {
          bg: 'var(--vy-bg)',
          surface: 'var(--vy-surface)',
          'surface-muted': 'var(--vy-surface-muted)',
          text: 'var(--vy-text)',
          muted: 'var(--vy-muted)',
          border: 'var(--vy-border)',
          primary: 'var(--vy-primary)',
          accent: 'var(--vy-accent)',
        }
      }
    }
  },
  plugins: []
};
