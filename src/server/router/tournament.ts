import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

export const tournamentRouter = createProtectedRouter()
  .query('getAll', {
    async resolve({ ctx }) {
      isAdminOrThrow(ctx)

      return await ctx.prisma.tournament.findMany({ include: { User: true } })
    },
  })
  .query('getOne', {
    input: z.string(),
    async resolve({ ctx, input }) {
      return await ctx.prisma.tournament.findUnique({ include: { User: true }, where: { id: input } })
    },
  })
  .mutation('delete', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      isAdminOrThrow(ctx)

      return ctx.prisma.tournament.delete({ where: { id: input } })
    },
  })
  .mutation('create', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const userId = isAdminOrThrow(ctx)

      return ctx.prisma.tournament.create({ data: { name: input, userId } })
    },
  })
