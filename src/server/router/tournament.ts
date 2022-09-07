import { Tournament, User } from '@prisma/client'
import { z } from 'zod'

import { createProtectedRouter, isAdminOrThrow } from './protected-router'

export const tournamentRouter = createProtectedRouter()
  .query('getAll', {
    async resolve({ ctx }) {
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
      const data = await ctx.prisma.tournament.findMany({
        include: { User: true },
        where: { status: 'ACTIVE' },
      })

      return data
    },
  })
  .query('getOne', {
    input: z.string(),
    async resolve({ ctx, input }) {
      const data = await ctx.prisma.tournament.findFirstOrThrow({
        include: { User: true },
        where: { id: input },
      })

      return data
    },
  })
  .mutation('delete', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      isAdminOrThrow(ctx)

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

      return ctx.prisma.tournament.update({ data: tournament, where: { id } })
    },
  })
  .mutation('toggle-status', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      isAdminOrThrow(ctx)
      const tournament = await ctx.prisma.tournament.findFirstOrThrow({ where: { id: input } })
      tournament.status = tournament.status === 'BUILDING' ? 'ACTIVE' : 'BUILDING'

      return ctx.prisma.tournament.update({ data: tournament, where: { id: input } })
    },
  })
  .mutation('create', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const userId = isAdminOrThrow(ctx)

      return ctx.prisma.tournament.create({ data: { name: input, userId } })
    },
  })
