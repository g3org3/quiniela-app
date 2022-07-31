import { z } from 'zod'

import { createRouter } from './context'

export const tournamentRouter = createRouter()
  .query('getAll', {
    async resolve({ ctx }) {
      return await ctx.prisma.tournament.findMany({ include: { User: true } })
    },
  })
  .mutation('create', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error('not authenticated')
      }
      // @ts-ignore
      if (ctx.session.user.role !== 'ADMIN') {
        throw new Error('not authorized')
      }

      return ctx.prisma.tournament.create({ data: { name: input, userId: ctx.session.user.id } })
    },
  })
