import { defineNuxtConfig } from 'nuxt'


export default defineNuxtConfig({
  ssr: false,

  runtimeConfig: {
    public: {
      ETH_RPOVIDER: process.env.ETH_RPOVIDER || 'https://eth.alphaclub.vip',
      BSC_RPOVIDER: process.env.BSC_RPOVIDER || 'https://bsc-dataseed.binance.org/',

      ALPHA_CLUB_001: process.env.ALPHA_CLUB_001 || '0x11111111aA58C2c51a1dd968050D3329573Faa39',
      MAPPING_GALLERY: process.env.MAPPING_GALLERY || '0x140e557D88E74446b55407a4f4bCD45A57741Fe1',
      MONARCH_MIXER: process.env.MONARCH_MIXER || '0x60B2D8fF61EA7adbee55BfC574F68AFFBaA9441b',
    }
  },

  // publicRuntimeConfig: {
  //   ETH_RPOVIDER: process.env.ETH_RPOVIDER || 'https://eth.alphaclub.vip',
  //   BSC_RPOVIDER: process.env.BSC_RPOVIDER || 'https://bsc-dataseed.binance.org/',

  //   ALPHA_CLUB_001: process.env.ALPHA_CLUB_001 || '0x11111111aA58C2c51a1dd968050D3329573Faa39',
  //   MAPPING_GALLERY: process.env.MAPPING_GALLERY || '0x140e557D88E74446b55407a4f4bCD45A57741Fe1',
  //   MONARCH_EVENTS: process.env.MONARCH_EVENTS || '0x140e557D88E74446b55407a4f4bCD45A57741Fe1',
  // },

  css: [
    "~/assets/css/tailwind.scss",
    '~/assets/css/base.scss',
    '~/assets/css/preset.scss',
  ],

  head: {
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    script: [],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'manifest', href: '/manifest.json' }
    ],
    style: []
  },

  buildModules: [
    '@nuxtjs/tailwindcss',
    ['nuxt-storm', { nested: true }]
  ],

  plugins: [
    // require('@tailwindcss/forms'),
  ],

  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
})
