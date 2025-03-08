export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const appId = query.appid;
    
    if (!appId) {
      console.log('Missing appId parameter in Steam reviews request');
      return {
        error: 'Missing appId parameter'
      };
    }
    
    try {
      console.log(`Fetching Steam reviews for appId: ${appId}`);
      
      const response = await fetch(`https://store.steampowered.com/appreviews/${appId}?json=1&num_per_page=100&purchase_type=all&language=english&summary=1`);
      
      if (!response.ok) {
        console.log(`Steam reviews API request failed with status ${response.status}`);
        throw new Error(`Steam API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Steam reviews response received for appId: ${appId}`);
      
      return data;
    } catch (error) {
      console.error('Error fetching from Steam API:', error);
      return {
        error: 'Failed to fetch review data from Steam API'
      };
    }
  });