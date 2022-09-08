import { RaceDriver, RaceTeam } from '@prisma/client'

import { createCache } from 'utils/cache'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

type R = RaceDriver & {
  raceteam: RaceTeam | null
}
const cacheMany = createCache<R[]>('racedriver')

export const racedriverRouter = createProtectedRouter().query('getAll', {
  // eslint-disable-next-line
  resolve: async ({ ctx }) => cacheMany.next('getAll', 'getAll', async () => {
      return await ctx.prisma.raceDriver.findMany({ include: { raceteam: true } })
    }),
})
