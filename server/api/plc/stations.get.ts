export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const response = await $fetch(`${config.public.plcApiBase}/stations`, {
      method: 'GET'
    })

    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch PLC stations'
    })
  }
})