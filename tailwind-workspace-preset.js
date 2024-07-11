module.exports = {
  theme: {
    extend: {
      gridTemplateColumns: {
        gallery: 'repeat(auto-fit, minmax(250px, 1fr))',
        pages: 'repeat(auto-fit, minmax(350px, 1fr))',
        'gutter-grid': '1fr min(64rem,100%) 1fr',
      },
      gridColumn: {
        'full-bleed': '1 / 4',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            visibility: 'hidden',
            transform: 'translateY(-20%)',
            opacity: 0.2,
          },
          '50%': {
            visibility: 'hidden',
            transform: 'translateY(-10%)',
          },
          '90%': {
            transform: 'translateY(3%)',
          },
          '100%': {
            visibility: 'visible',
            transform: 'translateY(0%)',
            opacity: 1,
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 500ms ease-in forwards',
      },
      boxShadow: {
        standard: '0 0px 8px 0px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
