<template>
    <div class="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      
      <div class="container mx-auto">
        <header class="mb-8">
          <h1 class="text-3xl md:text-4xl font-bold mb-2 text-[#FF4500] opacity-90">Game News</h1>
          <p class="text-gray-400">Latest gaming news and discussions from Reddit</p>
        </header>
    
        <div class="mb-6 flex">
          <input 
            v-model="searchQuery" 
            @keyup.enter="searchReddit"
            placeholder="Search game news (e.g. Baldur's Gate 3)" 
            class="w-full px-4 py-2 bg-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#FF4500]"
          />
          <button 
            @click="searchReddit"
            class="px-4 py-2 bg-[#FF4500] hover:bg-[#FF6314] rounded-r-lg transition"
          >
            Search
          </button>
        </div>
    
        <template v-if="isLoading">
          <div class="flex justify-center py-10">
            <div class="w-12 h-12 border-4 border-[#FF4500] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </template>
    
        <template v-else-if="error">
          <div class="bg-red-500/20 text-red-400 p-4 rounded-lg">
            {{ error }}
          </div>
        </template>
    
        <template v-else-if="news.length === 0 && searchQuery">
          <div class="bg-gray-800 p-8 rounded-lg text-center">
            <p class="text-gray-400">No news found for "{{ searchQuery }}". Try a different search term.</p>
          </div>
        </template>
    
        <template v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="item in news" 
              :key="item.id" 
              class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <img 
                :src="getImageUrl(item) || '/placeholderImage.png'" 
                :alt="item.title" 
                class="w-full h-48 object-cover"
              />
              <div class="p-6">
                <nuxt-link 
                  :to="`/news/${item.id}`" 
                  class="text-xl font-bold mb-2 line-clamp-2 hover:text-[#FF4500] transition"
                >
                  {{ item.title }}
                </nuxt-link>
                <div class="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>r/{{ item.subreddit }}</span>
                  <span>{{ formatDate(item.created_utc) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex items-center space-x-2">
                    <span class="text-[#FF4500]">👍 {{ item.ups }}</span>
                    <span class="text-[#FF4500]">💬 {{ item.num_comments }}</span>
                  </div>
                  <a 
                    :href="`https://reddit.com${item.permalink}`" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="px-3 py-1 bg-[#FF4500] text-white rounded hover:bg-[#FF6314] transition text-sm"
                  >
                    Reddit
                  </a>
                </div>
              </div>
            </div>
          </div>
    
          <div v-if="news.length" class="mt-10 flex justify-center gap-4">
            <button 
              v-if="page > 1" 
              @click="changePage(page - 1)" 
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
            >
              Previous
            </button>
            <span class="px-4 py-2 bg-gray-800 rounded">Page {{ page }}</span>
            <button 
              @click="changePage(page + 1)" 
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
            >
              Next
            </button>
          </div>
        </template>
      </div>
    </div>
  </template>
        
  <script setup>
  const placeholderImage = '/placeholder-image.png'
        
  const searchQuery = ref('')
  const news = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const page = ref(1)
        
  const { searchRedditNews } = useRedditApi()
  
  const getImageUrl = (item) => {
    if (item.thumbnail && 
        item.thumbnail !== 'self' && 
        item.thumbnail !== 'default' && 
        item.thumbnail.startsWith('http')) {
      return item.thumbnail
    }
    
    return placeholderImage
  }
        
  const searchReddit = async () => {
    if (!searchQuery.value.trim()) return
        
    isLoading.value = true
    error.value = null
        
    try {
      const response = await searchRedditNews({
        q: searchQuery.value,
        limit: 20,
        page: page.value
      })
        
      if (response.error) {
        error.value = response.error
      } else {
        news.value = response.data
      }
    } catch (err) {
      error.value = 'Failed to fetch game news'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
        
  const changePage = (newPage) => {
    page.value = newPage
    searchReddit()
  }
        
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
        
  onMounted(() => {
    searchQuery.value = 'video games'
    searchReddit()
  })
  </script>