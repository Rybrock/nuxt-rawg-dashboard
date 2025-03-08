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
  
  // Steam API Integration
  const findSteamAppId = (game) => {
    if (!game || !game.stores) return null;
  
    const steamStore = game.stores.find(store =>
      store.store && (store.store.id === 1 || store.store.slug === 'steam')
    );
  
    if (steamStore) {
      // Extract app ID from Steam URL if available
      if (steamStore.url) {
        const match = steamStore.url.match(/\/app\/(\d+)/);
        if (match && match[1]) {
          console.log("Detected Steam AppID:", match[1]);
          return match[1];
        }
      }
      console.log("Steam store found but no AppID extracted:", steamStore);
      return steamStore.id;
    }
  
    console.log("No Steam store found for game.");
    return null;
  };
  
  const fetchSteamGameData = async (appId) => {
    if (!appId) return null;
    
    try {
      const response = await fetch(`/api/steam/details?appid=${appId}`);
      
      if (!response.ok) {
        throw new Error(`Steam API request failed (Status: ${response.status})`);
      }
      
      const data = await response.json();
      return data[appId]?.success ? data[appId].data : null;
    } catch (error) {
      console.error('Error fetching Steam data:', error);
      return null;
    }
  };

  const fetchSteamPrice = async (appId) => {
    if (!appId) return null;
    
    try {
      const response = await fetch(`/api/steam/price?appids=${appId}`);
      
      if (!response.ok) {
        throw new Error(`Steam price API request failed (Status: ${response.status})`);
      }
      
      const data = await response.json();
      return data[appId]?.success ? data[appId].data : null;
    } catch (error) {
      console.error('Error fetching Steam price data:', error);
      return null;
    }
  };

  const fetchSteamReviews = async (appId) => {
    if (!appId) return null;
    
    try {
      const response = await fetch(`/api/steam/reviews?appid=${appId}`);
      
      if (!response.ok) {
        throw new Error(`Steam reviews API request failed (Status: ${response.status})`);
      }
      
      const data = await response.json();
      return data.success ? data : null;
    } catch (error) {
      console.error('Error fetching Steam reviews:', error);
      return null;
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
    searchYouTubeTrailers,
    // Steam API methods
    fetchSteamGameData,
    fetchSteamPrice,
    fetchSteamReviews,
    findSteamAppId
  }
}