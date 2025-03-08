<template>
    <header class="bg-gray-800 py-4 px-6 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <nuxt-link 
          to="/" 
          class="text-white hover:text-blue-400 transition flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </nuxt-link>
        
        <nuxt-link 
          to="/games/game-news" 
          class="text-white hover:text-blue-400 transition flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1h2a2 2 0 012 2v9a3 3 0 01-3 3zm0-2a1 1 0 001-1v-5h-9V6H5v12h14zM9 8h4v2H9V8zm0 4h4v2H9v-2z" />
          </svg>
          <span>Game News</span>
        </nuxt-link>
      </div>
      
      <div class="flex items-center space-x-4">
        <button 
          @click="toggleTheme" 
          class="text-white hover:text-blue-400 transition"
          title="Toggle Theme"
        >
          <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m3.343-5.657L5.929 5.929M18.071 5.929l1.414 1.414M6.343 18.657L4.93 20.07M19.071 18.657l1.414 1.414" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
    </header>
  </template>
  
  <script setup>
  const isDarkMode = ref(true)
  
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }
  </script>