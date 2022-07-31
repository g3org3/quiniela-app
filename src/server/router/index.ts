// src/server/router/index.ts
import superjson from 'superjson'

import { createRouter } from './context'
import { exampleRouter } from './example'
import { protectedExampleRouter } from './protected-example-router'
import { tournamentRouter } from './tournament'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('tournament.', tournamentRouter)
  .merge('example.', exampleRouter)
  .merge('question.', protectedExampleRouter)

// export type definition of API
export type AppRouter = typeof appRouter
