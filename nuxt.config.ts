export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  // 🚫 отключаем SSR, чтобы билд стал чисто статическим (для shared-хостинга)
  ssr: false,

  // 💡 если хочешь явно сказать, что это статик
  nitro: {
    preset: 'static'
  },

  devtools: { enabled: true },

  app: {
    // ⚙️ корневой путь сайта (если в корне домена, оставь "/")
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',

    // при желании — тайтл и мета
    head: {
      title: 'LibraryAI',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
      ],
    },
  },

  build: {},

  css: [
    '~/assets/scss/global.scss',
    'aos/dist/aos.css'
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    '@pinia/nuxt',
    'nuxt-swiper',
    'nuxt-aos',
  ],

  // 🔧 Общие env-переменные (public — чтобы были доступны на фронте)
  runtimeConfig: {
    apiSecret: '',
    public: {
      apiBase: 'https://api.libaryai.uz', // твой бэкэнд
      appUrl: 'https://libaryai.uz'
    }
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_vars.scss" as *;',
        },
      },
    },
  },
})
