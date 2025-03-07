<template>
    <div class="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <header class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold mb-2">Game Dashboard</h1>
        <p class="text-gray-400">Discover and explore games powered by RAWG API</p>
      </header>
      
      <GameFilters 
        :initial-filters="filters" 
        @update:filters="updateFilters" 
      />
      
      <template v-if="isLoading">
        <LoadingSpinner />
      </template>
      
      <template v-else-if="error">
        <div class="bg-red-500 text-white p-4 rounded-lg">
          {{ error }}. Please make sure you've added your RAWG API key to nuxt.config.js.
        </div>
      </template>
      
      <template v-else-if="games.length === 0">
        <div class="bg-gray-800 p-8 rounded-lg text-center">
          <p class="text-gray-400">No games found. Try adjusting your filters.</p>
        </div>
      </template>
      
      <template v-else>
        <div class="container mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <GameCard v-for="game in games" :key="game.id" :game="game" />
          </div>
        </div>
        
        <div class="mt-10 flex justify-center gap-4">
          <button 
            v-if="page > 1" 
            @click="changePage(page - 1)" 
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
          >
            Previous
          </button>
          <span class="px-4 py-2 bg-gray-800 rounded">Page {{ page }}</span>
          <button 
            v-if="hasNextPage" 
            @click="changePage(page + 1)" 
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
          >
            Next
          </button>
        </div>
      </template>
    </div>
  </template>
  
  <script setup>
  const { fetchGames } = useRawgApi()
  
  const games = ref([])
  const isLoading = ref(true)
  const error = ref(null)
  const page = ref(1)
  const hasNextPage = ref(false)
  
  const filters = ref({
    ordering: '-added',
    page_size: 20
  })
  
  const loadGames = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const params = {
        ...filters.value,
        page: page.value
      }
      
      const response = await fetchGames(params)
      
      if (response.error) {
        error.value = response.error
      } else {
        games.value = response.results
        hasNextPage.value = !!response.next
      }
    } catch (err) {
      error.value = 'Failed to fetch games'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
  
  const updateFilters = (newFilters) => {
    filters.value = {
      ...newFilters,
      page_size: 20
    }
    page.value = 1
    loadGames()
  }
  
  const changePage = (newPage) => {
    page.value = newPage
    loadGames()
  }
  
  watch(() => page.value, loadGames)
  
  onMounted(() => {
    loadGames()
  })
  </script>