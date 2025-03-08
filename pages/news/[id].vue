<template>
    <div class="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      
      <div class="container mx-auto max-w-4xl">
        <template v-if="isLoading">
          <div class="flex justify-center py-10">
            <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </template>
  
        <template v-else-if="error">
          <div class="bg-red-500/20 text-red-400 p-4 rounded-lg">
            {{ error }}
          </div>
        </template>
  
        <template v-else-if="post">
          <div class="bg-gray-800 rounded-lg overflow-hidden">
            <div class="p-6 border-b border-gray-700 flex flex-col items-center justify-between">
              <div class="flex items-center space-x-4 bg-violet-400 rounded-full px-3 py-1 text-xs font-bold mb-5">
                <button 
                  @click="goBack" 
                  class="text-gray-400 hover:text-white focus:outline-none flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span class="hidden sm:inline text-slate-950">Back to News</span>
                </button>
              </div>
              <div class="flex-grow text-center">
                <h1 class="text-2xl md:text-3xl font-bold">{{ post.title }}</h1>
              </div>
            </div>
  
            <div class="px-6 py-4 border-b border-gray-700">
              <div class="flex items-center justify-between text-sm text-gray-400">
                <div class="flex items-center space-x-4">
                  <span>Posted by u/{{ post.author }}</span>
                  <span>r/{{ post.subreddit }}</span>
                  <span>{{ formatDate(post.created_utc) }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span>👍 {{ post.ups }}</span>
                  <span>💬 {{ post.num_comments }}</span>
                </div>
              </div>
            </div>
  
            <div class="p-6">
              <div v-if="post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default'" class="mb-6">
                <img 
                  :src="post.thumbnail || '/placeholderImage.png'" 
                  :alt="post.title" 
                  class="w-full max-h-96 object-cover rounded-lg"
                />
              </div>
  
              <div v-if="post.selftext" class="prose prose-invert max-w-none mb-6">
                {{ post.selftext }}
              </div>
  
              <div v-if="post.url && post.url !== post.permalink" class="mb-6">
                <a 
                  :href="post.url" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="text-blue-400 hover:text-blue-300 break-all"
                >
                  {{ post.url }}
                </a>
              </div>
  
              <div class="mt-4 flex justify-between items-center">
                <a 
                  :href="`https://reddit.com${post.permalink}`" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="px-4 py-2 bg-[#FF4500] hover:bg-[#FF6314] rounded-md text-white transition"
                >
                  View on Reddit
                </a>
              </div>
            </div>
  
            <div v-if="comments.length" class="bg-gray-750 p-6">
              <h2 class="text-xl font-bold mb-4">Comments</h2>
              <div class="space-y-4">
                <div 
                  v-for="comment in comments" 
                  :key="comment.id"
                  class="bg-gray-800 rounded-lg p-4"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="text-sm text-gray-400">
                      u/{{ comment.author }} · {{ formatDate(comment.created_utc) }}
                    </div>
                    <div class="text-sm text-gray-400">👍 {{ comment.ups }}</div>
                  </div>
                  <div class="text-white">{{ comment.body }}</div>
  
                  <div v-if="comment.replies && comment.replies.length" class="mt-4 pl-4 border-l border-gray-700">
                    <div 
                      v-for="reply in comment.replies" 
                      :key="reply.id"
                      class="bg-gray-700 rounded-lg p-3 mt-2"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <div class="text-sm text-gray-400">
                          u/{{ reply.author }} · {{ formatDate(reply.created_utc) }}
                        </div>
                        <div class="text-sm text-gray-400">👍 {{ reply.ups }}</div>
                      </div>
                      <div class="text-white">{{ reply.body }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </template>
  
  <script setup>
  const route = useRoute()
  const router = useRouter()
  const { fetchPostDetails } = useRedditApi()
  
  const post = ref(null)
  const comments = ref([])
  const isLoading = ref(true)
  const error = ref(null)
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const goBack = () => {
    router.push('/games/game-news')
  }
  
  const loadPostDetails = async () => {
    isLoading.value = true
    error.value = null
  
    try {
      const postId = route.params.id
      const response = await fetchPostDetails(`/comments/${postId}`)
  
      if (response.error) {
        error.value = response.error
      } else {
        post.value = response.post
        comments.value = response.comments
      }
    } catch (err) {
      error.value = 'Failed to fetch post details'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
  
  onMounted(() => {
    loadPostDetails()
  })
  </script>
  
  <style scoped>
  .prose {
    max-width: 100%;
    color: theme('colors.white');
  }
  
  .prose a {
    color: theme('colors.blue.400');
    text-decoration: underline;
  }
  
  .prose a:hover {
    color: theme('colors.blue.300');
  }
  </style>