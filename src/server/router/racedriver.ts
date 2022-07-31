import { z } from 'zod'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

export const racedriverRouter = createProtectedRouter().query('getAll', {
  async resolve({ ctx }) {
    return await ctx.prisma.raceDriver.findMany({ include: { raceteam: true } })
  },
})
