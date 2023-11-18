export const catchErrors = async <T>(fn: () => Promise<T>): Promise<T | null> => {
  try {
    return await fn()
  } catch (error: any) {
    console.log(`Catch error: ${error}`)
    return null
  }
}
