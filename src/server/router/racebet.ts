import { RaceBet, RaceDriver, User } from '@prisma/client'
import { z } from 'zod'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

type RB = RaceBet & {
  User: User
  firstPlaceDriver: RaceDriver | null
  secondPlaceDriver: RaceDriver | null
  thirdPlaceDriver: RaceDriver | null
}

let cache: { [id: string]: RB | null } = {}
let cacheAll: { [id: string]: RB[] | null } = {}
const tap = <T>(obj: T, k: string) => {
  console.log('<- CACHE-HIT: ', k)

  return obj
}

export const raceBetRouter = createProtectedRouter()
  .query('getOneByRaceId', {
    input: z.string(),
    async resolve({ ctx, input }) {
      console.log('-> racebet.getOneByRaceId', input)
      if (cache[input]) return tap(cache[input], 'racebet.getOneByRaceId ' + input)

      const data = await ctx.prisma.raceBet.findFirst({
        where: { raceId: input, userId: ctx.session.user.id },
        include: { User: true, firstPlaceDriver: true, secondPlaceDriver: true, thirdPlaceDriver: true },
      })

      return (cache[input] = data)
    },
  })
  .query('getAllByRaceId', {
    input: z.string(),
    async resolve({ ctx, input }) {
      console.log('-> racebet.getAllByRaceId', input)
      if (cacheAll[input]) return tap(cacheAll[input], 'racebet.getAllByRaceId ' + input)

      const data = await ctx.prisma.raceBet.findMany({
        where: { raceId: input },
        include: { firstPlaceDriver: true, secondPlaceDriver: true, thirdPlaceDriver: true, User: true },
      })

      return (cacheAll[input] = data)
    },
  })
  .query('getAllByMeAndTournamentId', {
    input: z.string(),
    async resolve({ ctx, input }) {
      console.log('-> racebet.getAllByMeAndTournamentId', input)

      if (cacheAll[input]) return tap(cacheAll[input], 'racebet.getAllByMeAndTournamentId ' + input) as RB[]

      const racebet = await ctx.prisma.raceBet.findMany({
        where: { Race: { tournamentId: input, userId: ctx.session.user.id } },
        include: { firstPlaceDriver: true, secondPlaceDriver: true, thirdPlaceDriver: true, User: true },
      })

      return (cacheAll[input] = racebet)
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
      const userId = ctx.session.user.id as string

      const bet = await ctx.prisma.raceBet.findFirst({ where: { raceId, userId } })

      cache = {}
      cacheAll = {}

      const data = {
        raceId,
        userId,
        firstPlaceDriverId,
        secondPlaceDriverId,
        thirdPlaceDriverId,
      }

      if (bet) {
        return await ctx.prisma.raceBet.update({ data, where: { id: bet.id } })
      }

      return await ctx.prisma.raceBet.create({ data })
    },
  })
