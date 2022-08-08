import { RaceDriver, RaceTeam } from '@prisma/client'
import { z } from 'zod'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

type R = (RaceDriver & {
  raceteam: RaceTeam
})[]
const cache: Record<string, R> = {}
const tap = <T>(obj: T, k: string) => {
  console.log('<- CACHE-HIT: ', k)

  return obj
}

export const racedriverRouter = createProtectedRouter().query('getAll', {
  async resolve({ ctx }) {
    console.log('-> racedriver.getAll')
    if (cache['getAll']) return tap(cache['getAll'], 'racedriver.getAll')

    const data = await ctx.prisma.raceDriver.findMany({ include: { raceteam: true } })

    return (cache['getAll'] = data)
  },
})
