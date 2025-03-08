export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const appIds = query.appids;
    
    if (!appIds) {
      return {
        error: 'Missing appIds parameter'
      };
    }
    
    try {
      const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appIds}&filters=price_overview`);
      
      if (!response.ok) {
        throw new Error(`Steam API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching from Steam API:', error);
      return {
        error: 'Failed to fetch price data from Steam API'
      };
    }
  });