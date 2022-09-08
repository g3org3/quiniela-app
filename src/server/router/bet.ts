import { z } from 'zod'

import { createProtectedRouter } from './protected-router'

export const betRouter = createProtectedRouter()
  .query('getMineByMatchId', {
    input: z.string(),
    async resolve({ ctx, input }) {
      const data = await ctx.prisma.bet.findFirst({
        where: { matchId: input, userId: ctx.session.user.id },
      })

      return data
    },
  })
  .mutation('upsert', {
    input: z.object({
      matchId: z.string(),
      home: z.number(),
      away: z.number(),
    }),
    resolve: async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const bet = await ctx.prisma.bet.findFirst({ where: { matchId: input.matchId, userId } })

      if (!bet) {
        await ctx.prisma.bet.create({
          data: {
            awayTeamScore: input.away,
            homeTeamScore: input.home,
            matchId: input.matchId,
            userId,
          },
        })
      } else {
        await ctx.prisma.bet.update({
          data: {
            awayTeamScore: input.away,
            homeTeamScore: input.home,
          },
          where: { id: bet.id },
        })
      }
    },
  })
