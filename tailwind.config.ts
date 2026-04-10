import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        amber: {
          DEFAULT: '#C07838',
          light:   '#D4904A',
          glow:    'rgba(192,120,56,0.18)',
          subtle:  'rgba(192,120,56,0.08)',
          border:  'rgba(192,120,56,0.22)',
          strong:  'rgba(192,120,56,0.35)',
        },
        bg: {
          DEFAULT:  '#0B0906',
          card:     '#131009',
          elevated: '#1C1810',
        },
        text: {
          DEFAULT: '#FAF9F6',
          2:       '#C8C2B8',
          muted:   '#7D7568',
          dim:     '#48433C',
        },
        border: {
          DEFAULT: 'rgba(192,120,56,0.13)',
          strong:  'rgba(192,120,56,0.28)',
        },
        success: '#3E8A58',
        warning: '#BE8420',
        error:   '#B83C2F',
      },
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        sans:    ['Outfit', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      maxWidth: { site: '1200px' },
      borderRadius: { card: '12px', 'card-lg': '20px' },
    },
  },
}
export default config
