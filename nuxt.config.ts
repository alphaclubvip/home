import {defineNuxtConfig} from 'nuxt'


export default defineNuxtConfig({
    ssr: false,

    publicRuntimeConfig: {
        ETH_RPOVIDER: process.env.ETH_RPOVIDER || 'https://eth.alphaclub.vip',
        BSC_RPOVIDER: process.env.BSC_RPOVIDER || 'https://bsc-dataseed.binance.org/',
    },

    css: [
        "~/assets/css/tailwind.scss",
        '~/assets/css/base.scss',
        '~/assets/css/preset.scss',
    ],

    head: {
        meta: [
            {name: 'viewport', content: 'width=device-width, initial-scale=1'}
        ],
        script: [],
        link: [
            {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
            {rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png'},
            {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png'},
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
            {rel: 'manifest', href: '/manifest.json'}
        ],
        style: []
    },


    buildModules: [
        '@nuxtjs/tailwindcss',
        ['nuxt-storm', {nested: true}]
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
