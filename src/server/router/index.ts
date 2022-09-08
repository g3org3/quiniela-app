// src/server/router/index.ts
import superjson from 'superjson'

import { betRouter } from './bet'
import { createRouter } from './context'
import { groupRouter } from './group'
import { matchRouter } from './match'
import { raceRouter } from './race'
import { raceBetRouter } from './racebet'
import { racedriverRouter } from './racedriver'
import { raceteamRouter } from './raceteam'
import { tournamentRouter } from './tournament'
import { userRouter } from './user'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('tournament.', tournamentRouter)
  .merge('match.', matchRouter)
  .merge('race.', raceRouter)
  .merge('racedriver.', racedriverRouter)
  .merge('raceteam.', raceteamRouter)
  .merge('racebet.', raceBetRouter)
  .merge('user.', userRouter)
  .merge('group.', groupRouter)
  .merge('bet.', betRouter)

// export type definition of API
export type AppRouter = typeof appRouter
