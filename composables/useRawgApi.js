export const useRawgApi = () => {
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBaseUrl
    const apiKey = config.public.apiKey
  
    const fetchFromApi = async (endpoint, params = {}) => {
      const queryParams = new URLSearchParams({
        key: apiKey,
        ...params
      })
      
      try {
        const response = await fetch(`${baseUrl}/${endpoint}?${queryParams.toString()}`)
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }
        
        return await response.json()
      } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error)
        return { results: [], error: error.message }
      }
    }
  
    const fetchGames = async (params = {}) => {
      return fetchFromApi('games', params)
    }
  
    const fetchGameDetails = async (gameId) => {
      try {
        const response = await fetch(`${baseUrl}/games/${gameId}?key=${apiKey}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch game details (Status: ${response.status})`)
        }
        
        return await response.json()
      } catch (error) {
        console.error('Error fetching game details:', error)
        return { error: error.message }
      }
    }
  
    const fetchGameScreenshots = async (gameId) => {
      return fetchFromApi(`games/${gameId}/screenshots`)
    }
  
    const fetchGameTrailers = async (gameId) => {
      return fetchFromApi(`games/${gameId}/movies`)
    }
  
    const fetchGameReviews = async (gameId, params = {}) => {
      return fetchFromApi(`games/${gameId}/reviews`, params)
    }
  
    const fetchPlatforms = async (params = {}) => {
      return fetchFromApi('platforms', params)
    }
  
    const fetchGenres = async (params = {}) => {
      return fetchFromApi('genres', params)
    }
  
    const searchYouTubeTrailers = async (gameName) => {
        const youtubeApiKey = config.public.youtubeApiKey;
        const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search`;
      
        try {
          const response = await fetch(`${youtubeSearchUrl}?part=snippet&type=video&q=${encodeURIComponent(gameName + ' official game trailer')}&maxResults=1&key=${youtubeApiKey}`);
      
          if (!response.ok) {
            throw new Error(`YouTube API request failed (Status: ${response.status})`);
          }
      
          const data = await response.json();
      
          if (!data.items || data.items.length === 0) {
            return { results: [], error: "No trailers found" };
          }
      
          const video = data.items[0];
          const videoId = video.id.videoId;
      
          return {
            results: [
              {
                id: videoId,
                name: video.snippet.title,
                preview: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                data: {
                  480: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
                  max: `https://www.youtube.com/embed/${videoId}?autoplay=1`
                }
              }
            ]
          };
        } catch (error) {
          console.error("Error fetching YouTube trailers:", error);
          return { results: [], error: error.message };
        }
      };
      
  
    return {
      fetchGames,
      fetchGameDetails,
      fetchGameScreenshots,
      fetchGameTrailers,
      fetchGameReviews,
      fetchPlatforms,
      fetchGenres,
      searchYouTubeTrailers
    }
  }