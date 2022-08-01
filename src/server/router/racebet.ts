import { z } from 'zod'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

export const raceBetRouter = createProtectedRouter()
  .query('getOneByRaceId', {
    input: z.string(),
    async resolve({ ctx, input }) {
      const racebet = await ctx.prisma.raceBet.findFirst({
        where: { raceId: input, userId: ctx.session.user.id },
        include: { firstPlaceDriver: true, secondPlaceDriver: true, thirdPlaceDriver: true },
      })

      return racebet
    },
  })
  .query('getAllByRaceId', {
    input: z.string(),
    async resolve({ ctx, input }) {
      const racebet = await ctx.prisma.raceBet.findMany({
        where: { raceId: input },
        include: { firstPlaceDriver: true, secondPlaceDriver: true, thirdPlaceDriver: true, User: true },
      })

      return racebet
    },
  })
  .mutation('upsert', {
    input: z.object({
      raceId: z.string(),
      firstPlaceDriverId: z.string().nullish(),
      secondPlaceDriverId: z.string().nullish(),
      thirdPlaceDriverId: z.string().nullish(),
    }),
    async resolve({ ctx, input: { raceId, firstPlaceDriverId, secondPlaceDriverId, thirdPlaceDriverId } }) {
      const userId = ctx.session.user.id

      const bet = await ctx.prisma.raceBet.findFirst({ where: { raceId, userId } })

      const data = {
        raceId,
        firstPlaceDriverId,
        secondPlaceDriverId,
        thirdPlaceDriverId,
        userId,
      }

      if (bet) {
        return await ctx.prisma.raceBet.update({ data, where: { id: bet.id } })
      }

      return await ctx.prisma.raceBet.create({ data })
    },
  })
