import { User } from '@prisma/client'
import { z } from 'zod'

import { getPoints } from 'utils/race'

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
  .query('getAllByGroupIdAndToId', {
    input: z.object({
      groupId: z.string(),
      tournamentId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const tournament = await ctx.prisma.tournament.findUniqueOrThrow({ where: { id: input.tournamentId } })
      const userGroups = await ctx.prisma.usersOnGroups.findMany({
        where: { groupId: input.groupId },
        include: { User: true },
      })
      const userIds = Array.from(new Set(userGroups.map((g) => g.userId)))
      const leaderboardByUserId: Map<string, User & { points: number }> = new Map()
      userGroups.forEach((ug) => {
        leaderboardByUserId.set(ug.userId, { ...ug.User, points: 0 })
      })

      if (tournament.isRace) {
        const bets = await ctx.prisma.raceBet.findMany({
          where: { userId: { in: userIds }, Race: { tournamentId: input.tournamentId } },
          include: { firstPlaceDriver: true, secondPlaceDriver: true, thirdPlaceDriver: true, User: true },
        })
        const raceIds = Array.from(new Set(bets.map((b) => b.raceId)))
        const races = await ctx.prisma.race.findMany({
          where: { id: { in: raceIds } },
          include: { firstPlaceDriver: true, secondPlaceDriver: true, thirdPlaceDriver: true },
        })
        bets.forEach((bet) => {
          const res = leaderboardByUserId.get(bet.userId) || { ...bet.User, points: 0 }
          const [race] = races.filter((r) => r.id === bet.raceId)
          if (!race || race.startsAt.getTime() > Date.now()) return
          res.points = res.points + getPoints(race, bet).points
          leaderboardByUserId.set(bet.userId, res)
        })
      } else {
        const bets = await ctx.prisma.bet.findMany({
          where: { userId: { in: userIds }, Match: { tournamentId: input.tournamentId } },
          include: { User: true },
        })
        const matchIds = Array.from(new Set(bets.map((b) => b.matchId)))
        const matches = await ctx.prisma.match.findMany({
          where: { id: { in: matchIds } },
        })
        bets.forEach((bet) => {
          const res = leaderboardByUserId.get(bet.userId) || { ...bet.User, points: 0 }
          const [match] = matches.filter((m) => m.id === bet.matchId)
          if (!match || match.startsAt.getTime() > Date.now()) return
          // res.points = res.points + getPoints(match, bet).points
          leaderboardByUserId.set(bet.userId, res)
        })
      }

      return Array.from(leaderboardByUserId.values()).sort((a, b) => {
        return b.points - a.points
      })
    },
  })
