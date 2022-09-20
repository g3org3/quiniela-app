import { User } from '@prisma/client'
import { z } from 'zod'

import { getPoints } from 'utils/race'

import { createProtectedRouter } from './protected-router'

export const raceBetRouter = createProtectedRouter()
  .query('getOneByRaceId', {
    input: z.string(),
    async resolve({ ctx, input }) {
      const data = await ctx.prisma.raceBet.findFirst({
        where: { raceId: input, userId: ctx.session.user.id },
        include: { User: true, firstPlaceDriver: true, secondPlaceDriver: true, thirdPlaceDriver: true },
      })

      return data
    },
  })
  .query('getAllByRaceId', {
    input: z.string(),
    async resolve({ ctx, input }) {
      const userId = ctx.session.user.id
      const joinedGroups = await ctx.prisma.usersOnGroups.findMany({ where: { userId } })
      if (joinedGroups.length === 0) return []

      const joinedGroupIds = joinedGroups.map((group) => group.groupId)
      const userGroups = await ctx.prisma.usersOnGroups.findMany({
        where: {
          groupId: { in: joinedGroupIds },
        },
      })
      const userIds = Array.from(new Set(userGroups.map((g) => g.userId)))

      const data = await ctx.prisma.raceBet.findMany({
        where: { raceId: input, userId: { in: userIds } },
        include: { firstPlaceDriver: true, secondPlaceDriver: true, thirdPlaceDriver: true, User: true },
      })

      return data
    },
  })
  .query('getAllByUserId', {
    input: z.string(),
    async resolve({ ctx, input }) {
      const bets = await ctx.prisma.raceBet.findMany({
        where: { userId: input },
        orderBy: { Race: { startsAt: 'asc' } },
        include: {
          firstPlaceDriver: true,
          secondPlaceDriver: true,
          thirdPlaceDriver: true,
          User: true,
        },
      })

      const raceIds = Array.from(new Set(bets.map((b) => b.raceId)))
      const races = await ctx.prisma.race.findMany({
        where: { id: { in: raceIds } },
        orderBy: { startsAt: 'asc' },
        include: { firstPlaceDriver: true, secondPlaceDriver: true, thirdPlaceDriver: true },
      })

      return { races, bets }
    },
  })
  .query('getAllByMeAndTournamentId', {
    input: z.string(),
    async resolve({ ctx, input }) {
      const racebet = await ctx.prisma.raceBet.findMany({
        where: { Race: { tournamentId: input, userId: ctx.session.user.id } },
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
      const userId = ctx.session.user.id as string

      const bet = await ctx.prisma.raceBet.findFirst({ where: { raceId, userId } })

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
