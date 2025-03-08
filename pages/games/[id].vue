<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <template v-if="isLoading">
      <LoadingSpinner />
    </template>

    <template v-else-if="error">
      <div class="p-8 bg-black/60 text-white rounded-lg">
        <div class="bg-red-500 text-white p-4 rounded-lg">
          {{ error }}
        </div>
        <button
          @click="router.push('/')"
          class="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
        >
          Back to Dashboard
        </button>
      </div>
    </template>

    <template v-else>
      <div class="relative lg:h-64 md:h-56 h-48">
        <div class="absolute inset-0 bg-black/60 z-10"></div>
        <img
          :src="game.background_image"
          :alt="game.name"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
        <div
          class="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10 bg-gradient-to-t from-gray-900 to-transparent"
        >
          <div class="container mx-auto">
            <nuxt-link
              to="/"
              class="inline-flex items-center mb-4 px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition"
            >
              <span class="mr-1">←</span> Back to Dashboard
            </nuxt-link>
            <div class="flex flex-wrap items-center gap-4">
              <h1 class="text-3xl md:text-4xl font-bold">{{ game.name }}</h1>
              <div
                v-if="game.metacritic"
                :class="['px-3 py-1 rounded-md font-bold', metacriticColor]"
              >
                {{ game.metacritic }}
              </div>
            </div>
            <div class="mt-2 text-gray-400">
              Released: {{ formattedReleaseDate }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="screenshots.length > 0"
        class="container mx-auto py-3 px-4 md:px-6"
      >
        <div class="p-3 rounded-lg w-auto">
          <div
            class="flex overflow-x-auto space-x-3 py-2 px-1 scrollbar-thumb-gray-600 scrollbar-track-gray-900 scrollbar-thin"
          >
            <div
              v-for="screenshot in screenshots"
              :key="screenshot.id"
              class="flex-shrink-0 w-32 h-20 rounded-md overflow-hidden cursor-pointer border-2 hover:border-blue-500 transition-all"
              :class="{
                'border-blue-500':
                  selectedScreenshot && selectedScreenshot.id === screenshot.id,
                'border-transparent':
                  !selectedScreenshot ||
                  selectedScreenshot.id !== screenshot.id,
              }"
              @click="openScreenshotModal(screenshot)"
            >
              <img
                :src="screenshot.image"
                :alt="`${game.name} screenshot`"
                class="w-full h-full object-cover hover:opacity-90 transition"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto p-6 md:p-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div class="lg:col-span-2 space-y-8">
            <section>
              <h2 class="text-2xl font-bold mb-4">About</h2>
              <div
                v-html="game.description"
                class="text-white leading-relaxed"
              ></div>
            </section>

            <section
              class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors duration-200"
            >
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold">Reviews</h2>
                <button
                  @click="openReviewsModal"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium transition"
                >
                  View All Reviews
                </button>
              </div>

              <template v-if="isLoadingReviews">
                <div class="flex justify-center py-4">
                  <div
                    class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                  ></div>
                </div>
              </template>

              <template v-else-if="reviewsError">
                <p class="text-red-400 py-2">{{ reviewsError }}</p>
              </template>

              <template v-else-if="reviews.length === 0">
                <p class="text-gray-400 py-2">
                  No reviews available for this game.
                </p>
              </template>

              <template v-else>
                <div
                  class="bg-gray-750 rounded-lg p-4 cursor-pointer hover:bg-gray-700"
                  @click="openReviewsModal"
                >
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center gap-3">
                      <img
                        v-if="reviews[0].user?.avatar"
                        :src="reviews[0].user.avatar"
                        :alt="reviews[0].user?.username || 'User'"
                        class="w-10 h-10 rounded-full object-cover"
                        @error="
                          (event) =>
                            (event.target.src = '/images/default-avatar.jpg')
                        "
                      />
                      <div
                        v-else
                        class="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-xl font-bold"
                      >
                        {{ (reviews[0].user?.username || "U")[0] }}
                      </div>

                      <div>
                        <div class="font-semibold">
                          {{ reviews[0].user?.username || "Anonymous" }}
                        </div>
                        <div class="text-gray-400 text-sm">
                          {{ formatReviewDate(reviews[0].created) }}
                        </div>
                      </div>
                    </div>

                    <div
                      v-if="reviews[0].rating"
                      :class="[
                        'px-2 py-1 rounded text-xs font-bold',
                        reviewRatingColor(reviews[0].rating),
                      ]"
                    >
                      {{ reviews[0].rating }}
                    </div>
                  </div>

                  <div class="text-gray-300">
                    <h4
                      v-if="reviews[0].title"
                      class="font-bold text-white mb-1"
                    >
                      {{ reviews[0].title }}
                    </h4>
                    <p class="text-sm line-clamp-3">{{ reviews[0].text }}</p>
                  </div>

                  <div class="text-blue-400 text-sm mt-3 font-medium">
                    Read more reviews ({{ totalReviews }})
                  </div>
                </div>
              </template>
            </section>
            <!-- Add this section to your game details page template -->
<!-- Paste this inside the "space-y-8" div in the right column (after the existing aside elements) -->

<aside v-if="steamData" class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors duration-200">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold flex items-center">
        <img src="./steam-logo.svg" alt="Steam" class="w-6 h-6 mr-2 text-white" />
        Steam Data
      </h3>
      <a 
        v-if="steamAppId" 
        :href="`https://store.steampowered.com/app/${steamAppId}`" 
        target="_blank" 
        rel="noopener noreferrer"
        class="px-3 py-1 bg-[#1b2838] hover:bg-[#2a475e] rounded-md text-white text-sm font-medium transition"
      >
        View on Steam
      </a>
    </div>
  
    <div v-if="isLoadingSteam" class="flex justify-center py-4">
      <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  
    <div v-else class="space-y-4">
      <!-- Steam Price -->
      <div v-if="steamPrice">
        <h4 class="text-violet-200 mb-1">Price</h4>
        <div class="flex items-center">
          <span v-if="steamPrice.discount_percent > 0" class="line-through text-gray-400 mr-2">
            {{ steamPrice.initial_formatted }}
          </span>
          <span class="font-bold text-lg" :class="{'text-green-500': steamPrice.discount_percent > 0}">
            {{ steamPrice.final_formatted }}
          </span>
          <span v-if="steamPrice.discount_percent > 0" class="ml-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
            -{{ steamPrice.discount_percent }}%
          </span>
        </div>
      </div>
  
      <!-- Steam User Reviews -->
      <div v-if="steamReviews && steamReviews.query_summary">
        <h4 class="text-violet-200 mb-1">User Reviews</h4>
        <div class="flex items-center">
          <span 
            class="px-2 py-1 rounded text-sm font-bold mr-2" 
            :class="steamReviewColor"
          >
            {{ steamReviewSummary }}
          </span>
          <span class="text-gray-300">
            {{ steamReviews.query_summary.total_reviews.toLocaleString() }} reviews
          </span>
        </div>
      </div>
  
      <!-- Steam Categories -->
      <div v-if="steamData.categories && steamData.categories.length">
        <h4 class="text-violet-200 mb-1">Features</h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="category in steamData.categories"
            :key="category.id"
            class="px-2 py-1 rounded text-sm bg-gray-700 hover:bg-gray-600 text-white transition"
          >
            {{ category.description }}
          </span>
        </div>
      </div>
  
      <!-- Steam Release Date -->
      <div v-if="steamData.release_date">
        <h4 class="text-violet-200 mb-1">Steam Release Date</h4>
        <div>{{ steamData.release_date.date }}</div>
      </div>
  
      <!-- Achievements -->
      <div v-if="steamData.achievements">
        <h4 class="text-violet-200 mb-1">Achievements</h4>
        <div class="flex items-center">
          <span class="text-yellow-400 mr-2">🏆</span>
          <span>{{ steamData.achievements.total }}</span>
        </div>
      </div>
      
      <!-- DLCs -->
      <div v-if="steamData.dlc && steamData.dlc.length">
        <h4 class="text-violet-200 mb-1">DLCs Available</h4>
        <div class="flex items-center">
          <span class="text-green-400 mr-2">{{ steamData.dlc.length }}</span>
          <button 
            @click="openDlcModal" 
            class="text-blue-400 hover:text-blue-300 transition text-sm"
          >
            View DLCs
          </button>
        </div>
      </div>
    </div>
  </aside>
  
  <!-- Add this DLC Modal to your teleport section -->
  <Teleport to="body">
    <div
      v-if="showDlcModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 overflow-y-auto py-8"
      @click="closeDlcModal"
    >
      <div
        class="relative mx-auto w-full max-w-3xl bg-gray-900 rounded-lg shadow-xl"
        @click.stop
      >
        <div
          class="flex items-center justify-between p-6 border-b border-gray-700"
        >
          <h3 class="text-2xl font-bold text-white">
            DLCs for {{ game.name }}
          </h3>
          <button
            class="text-gray-400 hover:text-white"
            @click="closeDlcModal"
          >
            <span class="block w-6 h-6 relative">
              <span
                class="block absolute w-full h-0.5 bg-current top-1/2 left-0 -rotate-45"
              ></span>
              <span
                class="block absolute w-full h-0.5 bg-current top-1/2 left-0 rotate-45"
              ></span>
            </span>
          </button>
        </div>
  
        <div class="p-6 max-h-[calc(100vh-14rem)] overflow-y-auto">
          <div v-if="isLoadingDlc" class="py-10 flex justify-center">
            <div
              class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            ></div>
          </div>
          
          <div v-else-if="dlcList.length === 0" class="text-center py-10">
            <p class="text-gray-400">No DLC information available.</p>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="dlc in dlcList"
              :key="dlc.id"
              class="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition"
            >
              <img
                v-if="dlc.header_image"
                :src="dlc.header_image"
                :alt="dlc.name"
                class="w-full h-32 object-cover"
              />
              <div class="p-4">
                <h4 class="font-bold text-white">{{ dlc.name }}</h4>
                <div v-if="dlc.price" class="mt-2 flex items-center">
                  <span v-if="dlc.price.discount_percent > 0" class="line-through text-gray-400 mr-2">
                    {{ dlc.price.initial_formatted }}
                  </span>
                  <span class="font-bold" :class="{'text-green-500': dlc.price?.discount_percent > 0}">
                    {{ dlc.price.final_formatted }}
                  </span>
                  <span v-if="dlc.price.discount_percent > 0" class="ml-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    -{{ dlc.price.discount_percent }}%
                  </span>
                </div>
                <a
                  :href="`https://store.steampowered.com/app/${dlc.id}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-3 inline-block px-3 py-1 bg-[#1b2838] hover:bg-[#2a475e] rounded-md text-white text-sm transition"
                >
                  View on Steam
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
          </div>

          <div class="space-y-8">
            <aside
              v-if="trailers.length > 0"
              class="bg-gray-800 rounded-lg p-6"
            >
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-red-600">Trailers</h3>
                <button
                  @click="openTrailersModal"
                  class="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium transition"
                >
                  View All ({{ trailers.length }})
                </button>
              </div>
              <div class="grid grid-cols-1 gap-2">
                <div
                  v-for="trailer in trailers.slice(0, 2)"
                  :key="trailer.id"
                  class="rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                  @click="selectTrailer(trailer)"
                >
                  <img
                    :src="trailer.preview"
                    :alt="trailer.name"
                    class="w-full h-24 object-cover"
                  />
                </div>
              </div>
            </aside>
            <aside class="bg-gray-800 rounded-lg p-6">
              <h3 class="text-xl font-bold mb-4">Details</h3>

              <div class="space-y-4">
                <div v-if="game.platforms && game.platforms.length">
                  <h4 class="text-violet-200 mb-1">Platforms</h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="platform in game.platforms"
                      :key="platform.platform.id"
                      class="px-2 py-1 rounded text-sm bg-indigo-700 hover:bg-indigo-600 text-white transition"
                    >
                      {{ platform.platform.name }}
                    </span>
                  </div>
                </div>

                <div v-if="game.genres && game.genres.length">
                  <h4 class="text-violet-200 mb-1">Genres</h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="genre in game.genres"
                      :key="genre.id"
                      class="px-2 py-1 rounded text-sm bg-green-700 hover:bg-green-600 text-white transition"
                    >
                      {{ genre.name }}
                    </span>
                  </div>
                </div>

                <div v-if="game.developers && game.developers.length">
                  <h4 class="text-violet-200 mb-1">Developers</h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="developer in game.developers"
                      :key="developer.id"
                      class="px-2 py-1 rounded text-sm bg-purple-700 hover:bg-purple-600 text-white transition"
                    >
                      {{ developer.name }}
                    </span>
                  </div>
                </div>

                <div v-if="game.publishers && game.publishers.length">
                  <h4 class="text-violet-200 mb-1">Publishers</h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="publisher in game.publishers"
                      :key="publisher.id"
                      class="px-2 py-1 rounded text-sm bg-blue-700 hover:bg-blue-600 text-white transition"
                    >
                      {{ publisher.name }}
                    </span>
                  </div>
                </div>

                <div v-if="game.rating">
                  <h4 class="text-gray-400 mb-1">Rating</h4>
                  <div class="flex items-center">
                    <span class="text-yellow-500 mr-2">★</span>
                    <span>{{ game.rating }}/5</span>
                    <span class="text-gray-400 ml-2"
                      >({{ game.ratings_count }} ratings)</span
                    >
                  </div>
                </div>

                <div v-if="game.website">
                  <h4 class="text-violet-200 mb-1">Website</h4>
                  <a
                    :href="game.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-400 hover:text-blue-300 transition"
                  >
                    {{ game.website }}
                  </a>
                </div>
              </div>
            </aside>

            <aside
              v-if="game.tags && game.tags.length"
              class="bg-gray-800 rounded-lg p-6"
            >
              <h3 class="text-xl font-bold mb-4 text-yellow-500">Tags</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in game.tags"
                  :key="tag.id"
                  class="px-2 py-1 rounded text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 transition"
                >
                  {{ tag.name }}
                </span>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </template>

    <Teleport to="body">
      <div
        v-if="showTrailersModal"
        class="fixed inset-0 z-50 flex justify-center items-start bg-black/80 overflow-y-auto py-8 px-4"
        @click="closeTrailersModal"
      >
        <div
          class="relative w-full max-w-[90vw] md:max-w-4xl bg-gray-900 rounded-lg shadow-xl overflow-hidden mt-6 sm:mt-10 max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div
            class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700"
          >
            <h3 class="text-lg sm:text-2xl font-bold text-white">
              Trailers for {{ game.name }}
            </h3>
            <button
              class="text-violet-200 hover:text-white p-2"
              @click="closeTrailersModal"
            >
              ✖
            </button>
          </div>

          <div class="p-4 sm:p-6">
            <div v-if="selectedTrailer" class="mb-4 sm:mb-6">
              <div
                class="aspect-video w-full bg-black rounded-lg overflow-hidden"
              >
                <iframe
                  v-if="selectedTrailer && selectedTrailer.data.max"
                  :src="selectedTrailer.data.max"
                  class="w-full h-full"
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              </div>
              <h4 class="mt-3 text-base sm:text-lg font-semibold text-white">
                {{ selectedTrailer.name }}
              </h4>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div
                v-for="trailer in trailers"
                :key="trailer.id"
                class="rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition border-2"
                :class="{
                  'border-blue-500':
                    selectedTrailer && selectedTrailer.id === trailer.id,
                  'border-transparent':
                    !selectedTrailer || selectedTrailer.id !== trailer.id,
                }"
                @click="selectTrailer(trailer)"
              >
                <img
                  :src="
                    trailer.preview ||
                    `https://img.youtube.com/vi/${trailer.id}/maxresdefault.jpg`
                  "
                  :alt="trailer.name"
                  class="w-full h-24 object-cover"
                />
                <div class="p-2 bg-gray-800 text-sm text-white">
                  {{ trailer.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="selectedScreenshot"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        @click="closeScreenshotModal"
      >
        <div class="max-w-screen-lg max-h-screen p-4" @click.stop>
          <img
            :src="selectedScreenshot.image"
            :alt="game.name"
            class="max-w-full max-h-full object-contain"
          />
          <button
            class="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full"
            @click="closeScreenshotModal"
          >
            <span class="block w-6 h-6 relative">
              <span
                class="block absolute w-full h-0.5 bg-white top-1/2 left-0 -rotate-45"
              ></span>
              <span
                class="block absolute w-full h-0.5 bg-white top-1/2 left-0 rotate-45"
              ></span>
            </span>
          </button>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="showReviewsModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 overflow-y-auto py-8"
        @click="closeReviewsModal"
      >
        <div
          class="relative mx-auto w-full max-w-3xl bg-gray-900 rounded-lg shadow-xl"
          @click.stop
        >
          <div
            class="flex items-center justify-between p-6 border-b border-gray-700"
          >
            <h3 class="text-2xl font-bold text-white">
              Reviews for {{ game.name }}
            </h3>
            <button
              class="text-gray-400 hover:text-white"
              @click="closeReviewsModal"
            >
              <span class="block w-6 h-6 relative">
                <span
                  class="block absolute w-full h-0.5 bg-current top-1/2 left-0 -rotate-45"
                ></span>
                <span
                  class="block absolute w-full h-0.5 bg-current top-1/2 left-0 rotate-45"
                ></span>
              </span>
            </button>
          </div>

          <div class="p-6 max-h-[calc(100vh-14rem)] overflow-y-auto">
            <template v-if="isLoadingReviews">
              <div class="py-10 flex justify-center">
                <div
                  class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                ></div>
              </div>
            </template>

            <template v-else-if="reviewsError">
              <div class="bg-red-500/20 text-red-400 p-4 rounded-lg">
                {{ reviewsError }}
              </div>
            </template>

            <template v-else-if="reviews.length === 0">
              <div class="text-center py-10">
                <p class="text-gray-400">No reviews available for this game.</p>
              </div>
            </template>

            <template v-else>
              <div class="space-y-6">
                <div
                  v-for="review in reviews"
                  :key="review.id"
                  class="bg-gray-800 rounded-lg p-5 hover:bg-gray-750 transition"
                >
                  <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-3">
                      <img
                        v-if="review.user?.avatar"
                        :src="review.user.avatar"
                        :alt="review.user?.username || 'User'"
                        class="w-10 h-10 rounded-full object-cover"
                        @error="
                          (event) =>
                            (event.target.src = '/images/default-avatar.jpg')
                        "
                      />
                      <div
                        v-else
                        class="w-10 h-10 rounded-full bg-gray-600 text-wjite flex items-center justify-center text-xl font-bold"
                      >
                        {{ (review.user?.username || "U")[0] }}
                      </div>

                      <div>
                        <div class="font-semibold text-white">
                          {{ review.user?.username || "Anonymous" }}
                        </div>
                        <div class="text-gray-400 text-sm">
                          {{ formatReviewDate(review.created) }}
                        </div>
                      </div>
                    </div>

                    <div class="flex gap-1">
                      <div
                        :class="[
                          'px-2 py-1 rounded text-xs font-bold',
                          reviewRatingColor(review.rating),
                        ]"
                      >
                        {{ review.rating || "No rating" }}
                      </div>
                    </div>
                  </div>

                  <div class="text-gray-300 mb-3">
                    <h4 v-if="review.title" class="font-bold text-white mb-2">
                      {{ review.title }}
                    </h4>
                    <div class="text-sm leading-relaxed whitespace-pre-line">
                      {{ review.text }}
                    </div>
                  </div>

                  <div
                    class="flex justify-between items-center mt-4 text-sm text-gray-400"
                  >
                    <div>
                      <span v-if="review.likes_count > 0" class="mr-3">
                        👍 {{ review.likes_count }}
                      </span>
                      <span v-if="review.comments_count > 0">
                        💬 {{ review.comments_count }}
                      </span>
                    </div>

                    <a
                      v-if="review.external_url"
                      :href="review.external_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-400 hover:text-blue-300 transition"
                    >
                      Read full review
                    </a>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div
            class="border-t border-gray-700 p-4 flex justify-center items-center gap-2"
          >
            <button
              v-if="reviewPage > 1"
              @click="reviewPage--"
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition text-white"
              :disabled="isLoadingReviews"
            >
              Previous
            </button>
            <span class="px-4 py-2 bg-gray-800 rounded text-violet-200"
              >Page {{ reviewPage }}</span
            >
            <button
              v-if="hasMoreReviews"
              @click="reviewPage++"
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition text-white"
              :disabled="isLoadingReviews"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const {
  fetchGameDetails,
  fetchGameScreenshots,
  fetchGameReviews,
  searchYouTubeTrailers,
} = useRawgApi();

const game = ref({});
const screenshots = ref([]);
const selectedScreenshot = ref(null);
const isLoading = ref(true);
const error = ref(null);
const fallbackImage = "./placeholder-image.png";

const reviews = ref([]);
const reviewPage = ref(1);
const reviewsPerPage = 5;
const hasMoreReviews = ref(false);
const isLoadingReviews = ref(false);
const reviewsError = ref(null);
const showReviewsModal = ref(false);
const totalReviews = ref(0);

const trailers = ref([]);
const selectedTrailer = ref(null);
const showTrailersModal = ref(false);

const handleImageError = (event) => {
  event.target.src = fallbackImage;
};

const openScreenshotModal = (screenshot) => {
  selectedScreenshot.value = screenshot;
};

const closeScreenshotModal = () => {
  selectedScreenshot.value = null;
};

const openReviewsModal = () => {
  showReviewsModal.value = true;
  document.body.style.overflow = "hidden";
};

const closeReviewsModal = () => {
  showReviewsModal.value = false;
  document.body.style.overflow = "";
};

const openTrailersModal = () => {
  showTrailersModal.value = true;
  document.body.style.overflow = "hidden";

  if (!selectedTrailer.value && trailers.value.length > 0) {
    selectedTrailer.value = trailers.value[0];
  }
};

const closeTrailersModal = () => {
  showTrailersModal.value = false;
  selectedTrailer.value = null;
  document.body.style.overflow = "";
};

const selectTrailer = (trailer) => {
  if (!trailer) return;

  selectedTrailer.value = {
    id: trailer.id,
    name: trailer.name,
    preview: trailer.preview,
    data: {
      max: trailer.data.max,
    },
  };
};

const formatReviewDate = (dateString) => {
  if (!dateString) return "Unknown date";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const reviewRatingColor = (rating) => {
  if (!rating) return "bg-gray-600";
  if (rating >= 4) return "bg-green-600";
  if (rating >= 3) return "bg-yellow-600";
  return "bg-red-600";
};

const formattedReleaseDate = computed(() => {
  if (!game.value.released) return "TBA";
  const date = new Date(game.value.released);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const metacriticColor = computed(() => {
  const score = game.value.metacritic || 0;
  if (score >= 75) return "bg-green-600 text-white";
  if (score >= 50) return "bg-yellow-600 text-white";
  return "bg-red-600 text-white";
});

const loadGameData = async () => {
  isLoading.value = true;
  error.value = null;

  const gameId = route.params.id;

  try {
    const gameData = await fetchGameDetails(gameId);

    if (gameData.error) {
      error.value = gameData.error;
    } else {
      game.value = gameData;

      const screenshotsData = await fetchGameScreenshots(gameId);
      screenshots.value = screenshotsData.results || [];

      const youtubeTrailers = await searchYouTubeTrailers(game.value.name);
      trailers.value = youtubeTrailers.results || [];

      loadReviews();
    }
  } catch (err) {
    error.value = "Failed to fetch game details";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const loadReviews = async () => {
  isLoadingReviews.value = true;
  reviewsError.value = null;

  try {
    const gameId = route.params.id;
    const params = {
      page: reviewPage.value,
      page_size: reviewsPerPage,
    };

    const data = await fetchGameReviews(gameId, params);

    if (data.error) {
      reviewsError.value = data.error;
    } else {
      reviews.value = data.results;
      hasMoreReviews.value = !!data.next;
      totalReviews.value = data.count || reviews.value.length;
    }
  } catch (err) {
    reviewsError.value = "Failed to load reviews";
    console.error(err);
  } finally {
    isLoadingReviews.value = false;
  }
};

watch(
  () => reviewPage.value,
  () => {
    loadReviews();
  }
);

onMounted(() => {
  loadGameData();
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

.bg-gray-750 {
  background-color: #1e2738;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
