<template>
    <div class="bg-gray-800 p-4 rounded-lg mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <label class="text-white text-sm block mb-1">Search</label>
          <input 
            v-model="searchQuery" 
            @input="updateFilters"
            type="text" 
            placeholder="Search games..." 
            class="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="text-white text-sm block mb-1">Sort By</label>
          <select 
            v-model="sortBy" 
            @change="updateFilters"
            class="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="-added">Popularity</option>
            <option value="-released">Release Date</option>
            <option value="-rating">Rating</option>
            <option value="-metacritic">Metacritic</option>
            <option value="name">Name</option>
          </select>
        </div>
        
        <div>
          <label class="text-white text-sm block mb-1">
            Platforms
            <span v-if="isLoadingPlatforms" class="ml-1 text-xs text-gray-400">(Loading...)</span>
          </label>
          <select 
            v-model="platform" 
            @change="updateFilters"
            class="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="isLoadingPlatforms"
          >
            <option value="">All Platforms</option>
            <option v-for="platform in platforms" :key="platform.id" :value="platform.id">
              {{ platform.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="text-white text-sm block mb-1">
            Genres
            <span v-if="isLoadingGenres" class="ml-1 text-xs text-gray-400">(Loading...)</span>
          </label>
          <select 
            v-model="genre" 
            @change="updateFilters"
            class="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="isLoadingGenres"
          >
            <option value="">All Genres</option>
            <option v-for="genre in genres" :key="genre.id" :value="genre.id">
              {{ genre.name }}
            </option>
          </select>
        </div>
  
        <div>
          <label class="text-white text-sm block mb-1">Release Year</label>
          <select 
            v-model="year" 
            @change="updateFilters"
            class="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Years</option>
            <option v-for="y in yearOptions" :key="y" :value="y">
              {{ y }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    initialFilters: {
      type: Object,
      default: () => ({})
    }
  })
  
  const config = useRuntimeConfig()
  const emit = defineEmits(['update:filters'])
  
  const platforms = ref([])
  const genres = ref([])
  const isLoadingPlatforms = ref(true)
  const isLoadingGenres = ref(true)
  
  const searchQuery = ref(props.initialFilters.search || '')
  const sortBy = ref(props.initialFilters.ordering || '-added')
  const platform = ref(props.initialFilters.platforms || '')
  const genre = ref(props.initialFilters.genres || '')
  const year = ref(props.initialFilters.dates || '')
  
  const currentYear = new Date().getFullYear()
  const yearOptions = computed(() => {
    const years = []
    for (let y = currentYear; y >= 1970; y--) {
      years.push(y)
    }
    return years
  })
  
  const fetchPlatforms = async () => {
    isLoadingPlatforms.value = true
    try {
      const response = await fetch(`${config.public.apiBaseUrl}/platforms?key=${config.public.apiKey}`)
      const data = await response.json()
      
      platforms.value = data.results.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error('Error fetching platforms:', error)
      platforms.value = []
    } finally {
      isLoadingPlatforms.value = false
    }
  }
  
  const fetchGenres = async () => {
    isLoadingGenres.value = true
    try {
      const response = await fetch(`${config.public.apiBaseUrl}/genres?key=${config.public.apiKey}`)
      const data = await response.json()
      
      genres.value = data.results.sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error('Error fetching genres:', error)
      genres.value = []
    } finally {
      isLoadingGenres.value = false
    }
  }
  
  const updateFilters = () => {
    const filters = {
      search: searchQuery.value,
      ordering: sortBy.value,
      platforms: platform.value,
      genres: genre.value
    }
    
    if (year.value) {
      filters.dates = `${year.value}-01-01,${year.value}-12-31`
    }
    
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key]
    })
    
    emit('update:filters', filters)
  }
  
  onMounted(() => {
    fetchPlatforms()
    fetchGenres()
  })
  </script>