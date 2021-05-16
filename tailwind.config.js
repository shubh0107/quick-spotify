module.exports = {
  purge: [
    './src/**/*.js',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        'fadeIn': {
          '0%': {
            opacity: 0
          },
          '50%': {
            opacity: 0.5
          },
          '100%': {
            opacity: 1
          },
        },
        'fadeOut': {
          '0%': {
            opacity: 1
          },
          '50%': {
            opacity: 0.5
          },
          '100%': {
            opacity: 0
          },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-out': 'fadeOut 0.5s ease-out'
      }
    },
  },
  variants: {
    extend: {
      zIndex: ['hover'],
      animation: ['hover', 'group-hover']
    },
  },
  plugins: [],
}