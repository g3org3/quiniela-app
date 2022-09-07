import { Race, RaceDriver } from '@prisma/client'
import { DateTime } from 'luxon'
import { z } from 'zod'

import { createCache } from 'utils/cache'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

type R = Race & {
  firstPlaceDriver: RaceDriver | null
  secondPlaceDriver: RaceDriver | null
  thirdPlaceDriver: RaceDriver | null
}
const cacheMany = createCache<R[]>('race')
const cacheOne = createCache<R>('race')

export const raceRouter = createProtectedRouter()
  .query('getAll', {
    meta: { cache: cacheMany },
    input: z.string(),
    // eslint-disable-next-line
    resolve: async ({ ctx, input }) => cacheMany.next('getAll', input, async () => {
        const todayAndLast5Days = DateTime.now().minus({ days: 10 })

        return await ctx.prisma.race.findMany({
          where: { tournamentId: input, startsAt: { gt: todayAndLast5Days.toJSDate() } },
          orderBy: { startsAt: 'asc' },
          include: {
            firstPlaceDriver: true,
            secondPlaceDriver: true,
            thirdPlaceDriver: true,
          },
        })
      }),
  })
  .query('getOne', {
    input: z.string(),
    resolve: async ({ ctx, input }) => await ctx.prisma.race.findFirstOrThrow({ where: { id: input } }),
  })
  .query('getOneWithDrivers', {
    input: z.string(),
    // eslint-disable-next-line
    resolve: async ({ ctx, input }) => cacheOne.next('getOneWithDrivers', input, async () => {
        return await ctx.prisma.race.findFirstOrThrow({
          where: { id: input },
          include: { firstPlaceDriver: true, secondPlaceDriver: true, thirdPlaceDriver: true },
        })
      }),
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

      cacheMany.invalidate()

      return await ctx.prisma.race.create({ data })
    },
  })
