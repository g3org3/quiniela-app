import chalk from 'chalk'

const log = (...args: string[]) => {
  console.log(chalk.yellow('cache'), '-', ...args)
}

export const createCache = <T>(_label: string) => {
  let _cache = new Map<string, T | null>()
  type KeyOf<O> = O extends Map<infer V, T | null> ? V : never
  type K = KeyOf<typeof _cache>

  const invalidate = (keys?: Array<K>) => {
    if (!keys) {
      _cache = new Map()

      return
    }
    for (const key of keys) {
      if (key in _cache) {
        _cache.delete(key)
      }
    }
  }

  const next = async (label: string, key: K, db: () => Promise<T>) => {
    log(_label + '.' + label)
    const cacheHit = _cache.get(key)

    if (cacheHit) {
      log('[' + chalk.green('hit') + '] ', key)

      return Promise.resolve(cacheHit)
    }
    log('[' + chalk.red('miss') + '] ', key)
    const data = await db()
    _cache.set(key, data)

    return data
  }

  const nextNullable = async (label: string, key: K, db: () => Promise<T | null>) => {
    log(_label + '.' + label)
    const cacheHit = _cache.get(key)

    if (cacheHit) {
      log('[' + chalk.green('hit') + '] ', key)

      return Promise.resolve(cacheHit)
    }
    log('[' + chalk.red('miss') + '] ', key)
    const data = await db()
    _cache.set(key, data)

    return data
  }

  return { next, nextNullable, invalidate, invalidatAll: () => invalidate() }
}
