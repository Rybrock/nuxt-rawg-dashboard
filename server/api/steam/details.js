export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const appId = query.appid;
    
    if (!appId) {
        console.log('Missing appId parameter in Steam details request');
        return { error: 'Missing appId parameter' };
    }
    
    try {
        console.log(`Fetching Steam details for appId: ${appId}`);
        const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
        
        if (!response.ok) {
            console.log(`Steam API request failed with status ${response.status}`);
            throw new Error(`Steam API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Steam details response received for appId: ${appId}`, data);
        
        return data;
    } catch (error) {
        console.error('Error fetching from Steam API:', error);
        return { error: 'Failed to fetch data from Steam API' };
    }
});
