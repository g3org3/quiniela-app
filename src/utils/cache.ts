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

  const next = async <G>(label: string, key: K, db: () => Promise<G>): Promise<G> => {
    console.log('-> ' + _label + '.' + label)
    const cacheHit = _cache.get(key)

    if (cacheHit) {
      console.log('   <- [cache-hit] ', key)

      // return Promise.resolve(cacheHit)
    }

    const data = await db()
    // _cache.set(key, data)

    return data
  }

  return { next, invalidate, invalidatAll: () => invalidate() }
}
