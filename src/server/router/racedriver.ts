import { RaceDriver, RaceTeam } from '@prisma/client'

import { createCache } from 'utils/cache'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

type R = RaceDriver & {
  raceteam: RaceTeam | null
}
const cacheOne = createCache<R[]>('racedriver')

export const racedriverRouter = createProtectedRouter().query('getAll', {
  resolve: async ({ ctx }) =>
    cacheOne.next('getAll', 'getAll', async () => {
      return await ctx.prisma.raceDriver.findMany({ include: { raceteam: true } })
    }),
})
