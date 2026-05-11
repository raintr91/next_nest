export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  try {
    const response = await $fetch(`${config.public.mesApiBase}/work-orders`, {
      method: 'GET',
      query
    })

    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch work orders'
    })
  }
})