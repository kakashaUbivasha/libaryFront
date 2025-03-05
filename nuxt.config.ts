export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  build: {
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    apiSecret: ''
  },
  css:[
    '~/assets/scss/global.scss',
    'aos/dist/aos.css'
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_vars.scss" as *;',
        }
      }
    },
    vue: {
      template: {
      }
    }
  },

  modules: ['@pinia/nuxt', 'nuxt-swiper', "nuxt-aos"]
})