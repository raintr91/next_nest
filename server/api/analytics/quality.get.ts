export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  try {
    const response = await $fetch(`${config.public.apiBase}/analytics/quality`, {
      method: 'GET',
      query: {
        time_range: query.time_range || '7d'
      }
    })

    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch quality analytics'
    })
  }
})