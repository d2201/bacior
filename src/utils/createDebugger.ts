import debug from 'debug'

export const createDebugger = (namespace: string) => debug(`bacior:${namespace}`)