/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Official SBB Design System Colors from digital.sbb.ch
      colors: {
        sbb: {
          // Red palette
          red: '#EB0000',
          'red-125': '#C60018',
          'red-150': '#A20013',

          // Neutrals (official SBB naming)
          white: '#FFFFFF',
          milk: '#F6F6F6',
          cloud: '#E5E5E5',
          silver: '#DCDCDC',
          aluminum: '#D2D2D2',
          platinum: '#CDCDCD',
          cement: '#BDBDBD',
          graphite: '#B7B7B7',
          storm: '#A8A8A8',
          smoke: '#8D8D8D',
          metal: '#767676',
          granite: '#686868',
          anthracite: '#5A5A5A',
          iron: '#444444',
          charcoal: '#212121',
          midnight: '#151515',
          black: '#000000',

          // Blue
          blue: '#2D327D',

          // Functional colors (derived from SBB patterns)
          success: '#00973B',
          warning: '#FFAB00',
          error: '#EB0000',
          info: '#2D327D',
        }
      },
      fontFamily: {
        // SBB uses system fonts for mobile apps
        sans: [
          'SBB Web',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      // SBB spacing system (4px base)
      spacing: {
        'sbb-xs': '4px',
        'sbb-sm': '8px',
        'sbb-md': '16px',
        'sbb-lg': '24px',
        'sbb-xl': '32px',
        'sbb-2xl': '48px',
      },
      borderRadius: {
        'sbb-sm': '4px',
        'sbb-md': '8px',
        'sbb-lg': '16px',
        'sbb-xl': '24px',
      },
      boxShadow: {
        'sbb-card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'sbb-modal': '0 4px 24px rgba(0, 0, 0, 0.16)',
        'sbb-button': '0 2px 4px rgba(235, 0, 0, 0.24)',
      },
      fontSize: {
        // SBB typography scale
        'sbb-xs': ['12px', { lineHeight: '16px' }],
        'sbb-sm': ['14px', { lineHeight: '20px' }],
        'sbb-base': ['16px', { lineHeight: '24px' }],
        'sbb-lg': ['18px', { lineHeight: '28px' }],
        'sbb-xl': ['20px', { lineHeight: '28px' }],
        'sbb-2xl': ['24px', { lineHeight: '32px' }],
        'sbb-3xl': ['32px', { lineHeight: '40px' }],
      },
    },
  },
  plugins: [],
}
