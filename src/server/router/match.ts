import { z } from 'zod'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

export const matchRouter = createProtectedRouter()
  .query('getAllByTournamentId', {
    input: z.string(),
    async resolve({ ctx, input }) {
      return await ctx.prisma.match.findMany({ orderBy: { startsAt: 'asc' }, where: { tournamentId: input } })
    },
  })
  .mutation('delete', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      isAdminOrThrow(ctx)

      return ctx.prisma.match.delete({ where: { id: input } })
    },
  })
  .mutation('create', {
    input: z.object({
      homeTeam: z.string(),
      awayTeam: z.string(),
      location: z.string().nullish(),
      phase: z.string().nullish(),
      startsAt: z.date(),
      tournamentId: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const userId = isAdminOrThrow(ctx)
      const match = {
        homeTeam: input.homeTeam,
        awayTeam: input.awayTeam,
        location: input.location,
        phase: input.phase,
        startsAt: input.startsAt,
        tournamentId: input.tournamentId,
        userId,
      }

      return ctx.prisma.match.create({ data: match })
    },
  })
