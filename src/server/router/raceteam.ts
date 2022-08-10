import { RaceTeam } from '@prisma/client'
import { z } from 'zod'

import { createCache } from 'utils/cache'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

const cacheMany = createCache<RaceTeam[]>('raceteam')
export const raceteamRouter = createProtectedRouter().query('getAll', {
  resolve: async ({ ctx }) =>
    cacheMany.next('getAll', 'getAll', async () => {
      return await ctx.prisma.raceTeam.findMany()
    }),
})
