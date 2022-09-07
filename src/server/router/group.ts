import { z } from 'zod'

import { createProtectedRouter } from './protected-router'

export const groupRouter = createProtectedRouter()
  .query('getAllJoined', {
    resolve: async ({ ctx }) => {
      const userId = ctx.session.user.id

      return await ctx.prisma.usersOnGroups.findMany({ where: { userId }, include: { group: true } })
    },
  })
  .query('getOne', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.group.findUniqueOrThrow({ where: { id: input } })
    },
  })
  .query('getAllMine', {
    resolve: async ({ ctx }) => {
      const userId = ctx.session.user.id

      return await ctx.prisma.group.findMany({ where: { created_by_id: userId } })
    },
  })
  .mutation('join', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const group = await ctx.prisma.group.findUniqueOrThrow({ where: { id: input } })

      try {
        await ctx.prisma.usersOnGroups.create({
          data: {
            groupId: group.id,
            userId,
          },
        })
      } catch (err: any) {
        if (err.meta.target !== 'PRIMARY') throw err
      }

      return group
    },
  })
  .mutation('create', {
    input: z.string().min(3),
    resolve: async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const group = await ctx.prisma.group.create({
        data: {
          name: input,
          created_by_id: userId,
        },
      })

      await ctx.prisma.usersOnGroups.create({
        data: {
          groupId: group.id,
          userId,
        },
      })

      return group
    },
  })
