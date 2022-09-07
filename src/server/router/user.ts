import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createProtectedRouter } from './protected-router'

export const userRouter = createProtectedRouter()
  .query('getOne', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.user.findUniqueOrThrow({ select: { name: true }, where: { id: input } })
    },
  })
  .mutation('updateWallet', {
    input: z.string(),
    async resolve({ ctx, input }) {
      const data = {
        wallet: input,
      }

      return await ctx.prisma.user.update({ data, where: { id: ctx.session.user.id } })
    },
  })
