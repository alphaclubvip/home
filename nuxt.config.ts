import { resolve } from 'path'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
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
    ],

    // hooks: {
    //     // for build mode
    //     'vite:extendConfig'(clientConfig, {isClient}) {
    //         if (isClient && process.env.NODE_ENV === 'production') {
    //             clientConfig.resolve.alias.web3 = resolve(
    //                 __dirname,
    //                 './node_modules/web3/dist/web3.min.js'
    //             )
    //             // clientConfig.resolve.alias['@walletconnect/web3-provider'] = resolve(
    //             //     __dirname,
    //             //     './node_modules/@walletconnect/web3-provider/dist/umd/index.min.js'
    //         }
    //     },
    // },
    // // @ts-ignore
    // vite: {
    //     // in dev mode, vite use `esbuild`,so we should add `node polyfill`
    //     optimizeDeps: {
    //         esbuildOptions: {
    //             define: {
    //                 global: 'globalThis',
    //             },
    //             plugins: [
    //                 NodeGlobalsPolyfillPlugin({
    //                     process: true,
    //                     buffer: true,
    //                 }),
    //                 NodeModulesPolyfillPlugin()
    //             ],
    //         },
    //     },
    // },
})
