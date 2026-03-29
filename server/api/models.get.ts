export default defineEventHandler(async () => {
  const baseUrl = process.env.BASE_URL || 'https://api.openai.com/v1'
  const apiKey = process.env.OPENAI_API_KEY || ''
  
  try {
    const response = await fetch(`${baseUrl}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })
    
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: '获取模型列表失败',
      })
    }
    
    const data = await response.json()
    return data.data || []
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || '服务器错误',
    })
  }
})
