export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // 从环境变量获取配置
  const apiKey = process.env.OPENAI_API_KEY || ''
  const baseUrl = process.env.BASE_URL || 'https://api.openai.com/v1'
  
  // 如果是 OPTIONS 请求，直接返回
  if (event.method === 'OPTIONS') {
    return null
  }
  
  try {
    const body = await readBody(event)
    
    // 转发请求到 OpenAI
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw createError({
        statusCode: response.status,
        message: error.error?.message || '请求失败',
      })
    }
    
    // 返回流式响应
    return response.body
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '服务器错误',
    })
  }
})
