module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      zIndex: ['hover'],
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: 0
          },
          '50%': {
            opacity: 0.5
          },
          '100%': {
            opacity: 1
          },


        }
      }
    },
  },
  plugins: [],
}