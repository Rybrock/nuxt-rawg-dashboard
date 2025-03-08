export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    public: {
      apiBaseUrl: 'https://api.rawg.io/api',
      apiKey: process.env.RAWG_API_KEY,
      youtubeApiKey: process.env.YOUTUBE_API_KEY
    }
  },

  app: {
    head: {
      title: 'Game Dashboard - RAWG API',
      meta: [
        { name: 'description', content: 'Game information dashboard powered by RAWG API' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  compatibilityDate: '2025-03-07'
})