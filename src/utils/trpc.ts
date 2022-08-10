// src/utils/trpc.ts
import { RaceTeam } from '@prisma/client'
import { createReactQueryHooks } from '@trpc/react'
import type { inferProcedureOutput, inferProcedureInput } from '@trpc/server'

import type { AppRouter } from 'server/router'

export const trpc = createReactQueryHooks<AppRouter>()

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type inferQueryOutput<TRouteKey extends keyof AppRouter['_def']['queries']> = inferProcedureOutput<
  AppRouter['_def']['queries'][TRouteKey]
>

export type inferQueryInput<TRouteKey extends keyof AppRouter['_def']['queries']> = inferProcedureInput<
  AppRouter['_def']['queries'][TRouteKey]
>

export type inferMutationOutput<TRouteKey extends keyof AppRouter['_def']['mutations']> =
  inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>

export type inferMutationInput<TRouteKey extends keyof AppRouter['_def']['mutations']> = inferProcedureInput<
  AppRouter['_def']['mutations'][TRouteKey]
>

export type InferDriver<O> = O extends { firstPlaceDriver: infer V } ? V : never
export type TRPC_Driver = InferDriver<inferQueryOutput<'race.getOneWithDrivers'>>
export type TRPC_Raceteam = RaceTeam
export type TRPC_Racebet = inferQueryOutput<'racebet.getAllByMeAndTournamentId'>[number]
