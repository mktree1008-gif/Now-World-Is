import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './i18n/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        nwi: {
          bg: '#050b13',
          bgSoft: '#091321',
          panel: '#0f1a2a',
          panelSoft: '#101f31',
          border: '#27405f',
          text: '#eef4ff',
          muted: '#8da2be',
          accent: '#38bdf8',
          accentSoft: '#66d7ff',
          gold: '#d7b874'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(56, 189, 248, 0.45), 0 0 24px rgba(56, 189, 248, 0.3)'
      },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          'var(--font-inter)',
          'Inter',
          'var(--font-noto-sans)',
          'Noto Sans',
          'system-ui',
          'sans-serif'
        ],
        ui: [
          'var(--font-inter)',
          'Inter',
          'Pretendard Variable',
          'Pretendard',
          'var(--font-noto-sans)',
          'Noto Sans',
          'system-ui',
          'sans-serif'
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      }
    }
  },
  plugins: []
};

export default config;
