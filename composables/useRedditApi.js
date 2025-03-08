export function useRedditApi() {
    const searchRedditNews = async (params) => {
      try {
        const response = await $fetch('https://www.reddit.com/search.json', {
          params: {
            q: params.q || 'video games',
            sort: 'relevance',
            t: 'month',
            limit: params.limit || 20,
            after: params.page ? `t3_page_${params.page}` : undefined
          }
        })
  
        const transformedData = response.data.children.map(post => ({
          id: post.data.id,
          title: post.data.title,
          subreddit: post.data.subreddit,
          ups: post.data.ups,
          num_comments: post.data.num_comments,
          created_utc: post.data.created_utc,
          permalink: post.data.permalink,
          selftext: post.data.selftext,
          url: post.data.url,
          author: post.data.author,
          thumbnail: post.data.thumbnail && post.data.thumbnail.startsWith('http') 
            ? post.data.thumbnail 
            : post.data.preview?.images[0]?.source?.url || null
        }))
  
        return {
          data: transformedData,
          error: null
        }
      } catch (error) {
        console.error('Reddit API Error:', error)
        return {
          data: [],
          error: error.message || 'Failed to fetch Reddit news'
        }
      }
    }
  
    const fetchPostDetails = async (permalink) => {
      try {
        const response = await $fetch(`https://www.reddit.com${permalink}.json`)
        
        const postData = response[0].data.children[0].data
        const commentsData = response[1].data.children
  
        return {
          post: {
            id: postData.id,
            title: postData.title,
            selftext: postData.selftext,
            author: postData.author,
            subreddit: postData.subreddit,
            created_utc: postData.created_utc,
            ups: postData.ups,
            num_comments: postData.num_comments,
            url: postData.url,
            permalink: postData.permalink,
            thumbnail: postData.thumbnail && postData.thumbnail.startsWith('http') 
              ? postData.thumbnail 
              : postData.preview?.images[0]?.source?.url || null
          },
          comments: commentsData.map(comment => ({
            id: comment.data.id,
            author: comment.data.author,
            body: comment.data.body,
            created_utc: comment.data.created_utc,
            ups: comment.data.ups,
            replies: comment.data.replies?.data?.children?.map(reply => ({
              id: reply.data.id,
              author: reply.data.author,
              body: reply.data.body,
              created_utc: reply.data.created_utc,
              ups: reply.data.ups
            })) || []
          })).slice(0, 10)
        }
      } catch (error) {
        console.error('Reddit Post Details Error:', error)
        return {
          post: null,
          comments: [],
          error: error.message || 'Failed to fetch post details'
        }
      }
    }
  
    return {
      searchRedditNews,
      fetchPostDetails
    }
  }