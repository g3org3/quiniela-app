import { z } from 'zod'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

export const matchRouter = createProtectedRouter()
  .query('getAllByTournamentId', {
    input: z.string(),
    async resolve({ ctx, input }) {
      return await ctx.prisma.match.findMany({ orderBy: { startsAt: 'asc' }, where: { tournamentId: input } })
    },
  })
  .query('getOneById', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.match.findUniqueOrThrow({ where: { id: input }, include: { Tournament: true } })
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
      homeTeamUrl: z.string(),
      awayTeam: z.string(),
      awayTeamUrl: z.string(),
      location: z.string().nullish(),
      phase: z.string().nullish(),
      startsAt: z.date(),
      tournamentId: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const userId = isAdminOrThrow(ctx)

      return ctx.prisma.match.create({
        data: {
          homeTeam: input.homeTeam,
          homeTeamImage: input.homeTeamUrl,
          awayTeam: input.awayTeam,
          awayTeamImage: input.awayTeamUrl,
          location: input.location,
          phase: input.phase,
          startsAt: input.startsAt,
          tournamentId: input.tournamentId,
          userId,
        },
      })
    },
  })
