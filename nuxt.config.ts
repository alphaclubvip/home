import { defineNuxtConfig } from 'nuxt'


export default defineNuxtConfig({
    ssr: false,

    publicRuntimeConfig: {
        ETH_RPOVIDER: process.env.ETH_RPOVIDER || 'https://eth.alphaclub.vip',
        BSC_RPOVIDER: process.env.BSC_RPOVIDER || 'https://bsc-dataseed.binance.org/',
    },

    buildModules: ['@nuxtjs/tailwindcss'],

    css: [
        '~/assets/css/base.scss',
        '~/assets/css/preset.scss',
    ],
})
