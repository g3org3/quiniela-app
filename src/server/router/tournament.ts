import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createRouter } from './context'

export const tournamentRouter = createRouter()
  .query('getAll', {
    async resolve({ ctx }) {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      // @ts-ignore
      if (ctx.session.user.role !== 'ADMIN') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      return await ctx.prisma.tournament.findMany({ include: { User: true } })
    },
  })
  .mutation('delete', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      // @ts-ignore
      if (ctx.session.user.role !== 'ADMIN') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      return ctx.prisma.tournament.delete({ where: { id: input } })
    },
  })
  .mutation('create', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      // @ts-ignore
      if (ctx.session.user.role !== 'ADMIN') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      return ctx.prisma.tournament.create({ data: { name: input, userId: ctx.session.user.id } })
    },
  })
