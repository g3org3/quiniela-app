import { z } from 'zod'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

export const raceteamRouter = createProtectedRouter().query('getAll', {
  async resolve({ ctx }) {
    return await ctx.prisma.raceTeam.findMany()
  },
})
