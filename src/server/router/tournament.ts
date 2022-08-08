import { Tournament, User } from '@prisma/client'
import { z } from 'zod'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

type T = Tournament & {
  User: User
}
const cacheGetAll: { [id: string]: T[] | null } = {}
const cacheById: {
  [id: string]: T | null
} = {}
const tap = <T>(obj: T, k: string) => {
  console.log('<- CACHE-HIT: ', k)

  return obj
}

export const tournamentRouter = createProtectedRouter()
  .query('getAll', {
    async resolve({ ctx }) {
      console.log('-> tournament.getAll')
      isAdminOrThrow(ctx)

      const data = await ctx.prisma.tournament.findMany({
        include: { User: true },
        orderBy: { status: 'asc' },
      })

      return data
    },
  })
  .query('getAllActive', {
    async resolve({ ctx }) {
      console.log('-> tournament.getAllActive')
      if (cacheGetAll['getAllActive']) return tap(cacheGetAll['getAllActive'], 'tournaments.getAllActive')

      const data = await ctx.prisma.tournament.findMany({
        include: { User: true },
        where: { status: 'ACTIVE' },
      })

      return (cacheGetAll['getAllActive'] = data)
    },
  })
  .query('getOne', {
    input: z.string(),
    async resolve({ ctx, input }) {
      console.log('-> tournament.getOne', input)
      if (cacheById[input]) return tap(cacheById[input], 'tournaments.getOne ' + input)

      const data = await ctx.prisma.tournament.findFirstOrThrow({
        include: { User: true },
        where: { id: input },
      })

      return (cacheById[input] = data)
    },
  })
  .mutation('delete', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      isAdminOrThrow(ctx)

      cacheById[input] = null
      cacheGetAll['getAllActive'] = null

      return ctx.prisma.tournament.delete({ where: { id: input } })
    },
  })
  .mutation('rename', {
    input: z.object({
      id: z.string(),
      name: z.string(),
    }),
    resolve: async ({ ctx, input: { id, name } }) => {
      isAdminOrThrow(ctx)
      const tournament = await ctx.prisma.tournament.findFirstOrThrow({ where: { id } })
      tournament.name = name

      cacheById[id] = null
      cacheGetAll['getAllActive'] = null

      return ctx.prisma.tournament.update({ data: tournament, where: { id } })
    },
  })
  .mutation('update-image', {
    input: z.object({
      id: z.string(),
      image: z.string(),
    }),
    resolve: async ({ ctx, input: { id, image } }) => {
      isAdminOrThrow(ctx)
      const tournament = await ctx.prisma.tournament.findFirstOrThrow({ where: { id } })
      tournament.image = image

      cacheById[id] = null
      cacheGetAll['getAllActive'] = null

      return ctx.prisma.tournament.update({ data: tournament, where: { id } })
    },
  })
  .mutation('toggle-status', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      isAdminOrThrow(ctx)
      const tournament = await ctx.prisma.tournament.findFirstOrThrow({ where: { id: input } })
      tournament.status = tournament.status === 'BUILDING' ? 'ACTIVE' : 'BUILDING'

      cacheById[input] = null
      cacheGetAll['getAllActive'] = null

      return ctx.prisma.tournament.update({ data: tournament, where: { id: input } })
    },
  })
  .mutation('create', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const userId = isAdminOrThrow(ctx)

      cacheGetAll['getAllActive'] = null

      return ctx.prisma.tournament.create({ data: { name: input, userId } })
    },
  })
