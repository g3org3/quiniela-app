// src/server/router/index.ts
import superjson from 'superjson'

import { createRouter } from './context'
import { matchRouter } from './match'
import { raceRouter } from './race'
import { racedriverRouter } from './racedriver'
import { raceteamRouter } from './raceteam'
import { tournamentRouter } from './tournament'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('tournament.', tournamentRouter)
  .merge('match.', matchRouter)
  .merge('race.', raceRouter)
  .merge('racedriver.', racedriverRouter)
  .merge('raceteam.', raceteamRouter)

// export type definition of API
export type AppRouter = typeof appRouter
