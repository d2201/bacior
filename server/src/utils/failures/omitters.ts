import { NotFoundFailure } from '.'

export const omitNotFoundFailure = async <T>(
  cb: () => Promise<T>
): Promise<T | undefined> => {
  try {
    return await cb()
  } catch (e) {
    if (e instanceof NotFoundFailure) {
      return
    }
    throw e
  }
}
