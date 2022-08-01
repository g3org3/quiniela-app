import { z } from 'zod'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

export const raceRouter = createProtectedRouter()
  .query('getAll', {
    input: z.string(),
    async resolve({ ctx, input }) {
      return await ctx.prisma.race.findMany({
        where: { tournamentId: input },
        orderBy: { startsAt: 'asc' },
        include: {
          firstPlaceDriver: true,
          secondPlaceDriver: true,
          thirdPlaceDriver: true,
        },
      })
    },
  })
  .query('getOne', {
    input: z.string(),
    async resolve({ ctx, input }) {
      return await ctx.prisma.race.findFirstOrThrow({ where: { id: input } })
    },
  })
  .query('getOneWithDrivers', {
    input: z.string(),
    async resolve({ ctx, input }) {
      return await ctx.prisma.race.findFirstOrThrow({
        where: { id: input },
        include: { firstPlaceDriver: true, secondPlaceDriver: true, thirdPlaceDriver: true },
      })
    },
  })
  .mutation('upsertDrivers', {
    input: z.object({
      raceId: z.string(),
      firstPlaceDriverId: z.string().nullish(),
      secondPlaceDriverId: z.string().nullish(),
      thirdPlaceDriverId: z.string().nullish(),
    }),
    async resolve({ ctx, input: { raceId, firstPlaceDriverId, secondPlaceDriverId, thirdPlaceDriverId } }) {
      const userId = isAdminOrThrow(ctx)

      const race = await ctx.prisma.race.findFirstOrThrow({ where: { id: raceId, userId } })

      const data = {
        firstPlaceDriverId,
        secondPlaceDriverId,
        thirdPlaceDriverId,
      }

      return await ctx.prisma.race.update({ data, where: { id: race.id } })
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
