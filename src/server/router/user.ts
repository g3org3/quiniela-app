import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createProtectedRouter } from './protected-router'

export const userRouter = createProtectedRouter().mutation('updateWallet', {
  input: z.string(),
  async resolve({ ctx, input }) {
    const data = {
      wallet: input,
    }

    return await ctx.prisma.user.update({ data, where: { id: ctx.session.user.id } })
  },
})
