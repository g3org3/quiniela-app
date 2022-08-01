import { z } from 'zod'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

export const raceRouter = createProtectedRouter()
  .query('getAll', {
    input: z.string(),
    async resolve({ ctx, input }) {
      return await ctx.prisma.race.findMany({ where: { tournamentId: input }, orderBy: { startsAt: 'asc' } })
    },
  })
  .query('getOne', {
    input: z.string(),
    async resolve({ ctx, input }) {
      return await ctx.prisma.race.findFirstOrThrow({ where: { id: input } })
    },
  })
  .mutation('create', {
    input: z.object({
      name: z.string(),
      circuit: z.string().nullish(),
      image: z.string().nullish(),
      startsAt: z.date(),
      tournamentId: z.string(),
    }),
    async resolve({ ctx, input: { name, circuit, image, startsAt, tournamentId } }) {
      const userId = isAdminOrThrow(ctx)

      const data = {
        name,
        circuit,
        image,
        startsAt,
        tournamentId,
        userId,
      }

      return await ctx.prisma.race.create({ data })
    },
  })
