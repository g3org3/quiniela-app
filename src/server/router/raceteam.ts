import { z } from 'zod'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

export const raceteamRouter = createProtectedRouter().query('getAll', {
  async resolve({ ctx }) {
    console.log('-> raceteam.getAll')

    return await ctx.prisma.raceTeam.findMany()
  },
})
