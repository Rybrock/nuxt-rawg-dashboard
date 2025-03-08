<template>
    <div 
      @click="navigateToGame"
      class="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl h-full flex flex-col">
      <div class="relative">
        <img 
          :src="game.background_image" 
          :alt="game.name" 
          class="w-full h-80 object-cover"
          @error="handleImageError">
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div class="flex items-center space-x-2">
            <span v-if="game.metacritic" 
                  :class="['px-2 py-1 text-xs rounded font-bold', metacriticColor]">
              {{ game.metacritic }}
            </span>
            <span class="text-xs text-gray-300">{{ formattedReleaseDate }}</span>
          </div>
        </div>
      </div>
      <div class="p-5 flex flex-col flex-grow">
        <h3 class="text-xl font-bold text-white mb-3 line-clamp-1">{{ game.name }}</h3>
        <div class="flex flex-wrap gap-2 mb-3">
          <span 
            v-for="genre in limitedGenres" 
            :key="genre.id" 
            class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
            {{ genre.name }}
          </span>
        </div>
        <div class="flex items-center text-gray-400 text-sm mt-auto">
          <span>{{ platforms }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    game: {
      type: Object,
      required: true
    }
  })
  
  const router = useRouter()
  
  
  const handleImageError = (event) => {
    event.target.src = fallbackImage
  }
  
  const navigateToGame = () => {
    router.push(`/games/${props.game.id}`)
  }
  
  const formattedReleaseDate = computed(() => {
    if (!props.game.released) return 'TBA'
    const date = new Date(props.game.released)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  })
  
  const limitedGenres = computed(() => {
    return props.game.genres?.slice(0, 3) || []
  })
  
  const platforms = computed(() => {
    const platformList = props.game.platforms?.map(p => p.platform.name) || []
    return platformList.slice(0, 3).join(', ') + (platformList.length > 3 ? '...' : '')
  })
  
  const metacriticColor = computed(() => {
    const score = props.game.metacritic || 0
    if (score >= 75) return 'bg-green-600 text-white'
    if (score >= 50) return 'bg-yellow-600 text-white'
    return 'bg-red-600 text-white'
  })
  </script>