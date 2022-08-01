import { Badge, Flex, Heading, Image, Select, Skeleton, SkeletonText, Text, useToast } from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import CustomLink from 'components/CustomLink'
import { trpc, TRPC_Driver, TRPC_Raceteam } from 'utils/trpc'

interface Props {
  //
}

// TODO: make a driver choose component
// TODO: view other bets maybe in the admin
const Race = (_: Props) => {
  useSession({ required: true })
  const router = useRouter()
  const toast = useToast()
  const { invalidateQueries } = trpc.useContext()
  const raceId = router.query.raceId as string
  const tournamentId = router.query.tournamentId as string

  const race = trpc.useQuery(['race.getOneWithDrivers', raceId])
  const drivers = trpc.useQuery(['racedriver.getAll'])
  const tournament = trpc.useQuery(['tournament.getOne', tournamentId])
  const racebet = trpc.useQuery(['racebet.getOneByRaceId', raceId])

  // TODO: infer the specific key firstDriver of a type
  const [firstDriver, setFirstDriver] = useState<TRPC_Driver | null>(null)
  const [secondDriver, setSecondDriver] = useState<TRPC_Driver | null>(null)
  const [thirdDriver, setThirdDriver] = useState<TRPC_Driver | null>(null)

  useEffect(() => {
    setFirstDriver(racebet.data?.firstPlaceDriver as TRPC_Driver)
  }, [racebet.data?.firstPlaceDriverId])

  useEffect(() => {
    setSecondDriver(racebet.data?.secondPlaceDriver as TRPC_Driver)
  }, [racebet.data?.secondPlaceDriverId])

  useEffect(() => {
    setThirdDriver(racebet.data?.thirdPlaceDriver as TRPC_Driver)
  }, [racebet.data?.thirdPlaceDriverId])

  const upsertBet = trpc.useMutation('racebet.upsert', {
    onSuccess() {
      toast({ variant: 'left-accent', title: 'updated', status: 'success' })
      invalidateQueries(['racebet.getOneByRaceId'])
    },
    onError(err) {
      toast({
        variant: 'left-accent',
        title: 'Something went wrong',
        status: 'error',
        description: err.message,
      })
    },
  })

  const teamsById: Record<string, TRPC_Raceteam> = {}
  const driversById =
    drivers.data?.reduce<Record<string, TRPC_Driver>>((_byId, driver) => {
      if (!_byId[driver.id]) {
        // @ts-ignore
        _byId[driver.id] = driver
        if (!teamsById[driver.raceTeamId]) {
          teamsById[driver.raceTeamId] = driver.raceteam
        }
      }

      return _byId
    }, {}) || {}

  const onChangeFirstDriver: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const driver = driversById[e.target.value]
    if (!driver) return
    setFirstDriver(driver)
    upsertBet.mutate({ firstPlaceDriverId: driver.id, raceId })
  }
  const onChangeSecondDriver: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const driver = driversById[e.target.value]
    if (!driver) return
    setSecondDriver(driver)
    upsertBet.mutate({ secondPlaceDriverId: driver.id, raceId })
  }
  const onChangeThirdDriver: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const driver = driversById[e.target.value]
    if (!driver) return
    setThirdDriver(driver)
    upsertBet.mutate({ thirdPlaceDriverId: driver.id, raceId })
  }

  const isOpen = race.data?.startsAt ? (race.data?.startsAt > new Date() ? true : false) : false

  let points = 0
  const isFirstOk = race.data?.firstPlaceDriverId === racebet.data?.firstPlaceDriverId
  if (isFirstOk) {
    points += 2
  }
  const isFirstTeamOk = race.data?.firstPlaceDriver?.raceTeamId === racebet.data?.firstPlaceDriver?.raceTeamId
  if (isFirstTeamOk) {
    points += 1
  }
  const isSecondOk = race.data?.secondPlaceDriverId === racebet.data?.secondPlaceDriverId
  if (isSecondOk) {
    points += 2
  }
  const isSecondTeamOk =
    race.data?.secondPlaceDriver?.raceTeamId === racebet.data?.secondPlaceDriver?.raceTeamId
  if (isSecondTeamOk) {
    points += 1
  }
  const isThirdOk = race.data?.thirdPlaceDriverId === racebet.data?.thirdPlaceDriverId
  if (isThirdOk) {
    points += 2
  }
  const isThirdTeamOk = race.data?.thirdPlaceDriver?.raceTeamId === racebet.data?.thirdPlaceDriver?.raceTeamId
  if (isThirdTeamOk) {
    points += 1
  }

  return (
    <Flex flexDir="column" gap={10} pb={10}>
      <Heading fontWeight="normal" textTransform="capitalize">
        <CustomLink href={`/tournaments/${tournamentId}/race`}>{tournament.data?.name || 'Races'}</CustomLink>
      </Heading>
      <Flex
        gap={2}
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor="gray.200"
        alignItems="center"
        position="relative"
      >
        {!race.isLoading && !racebet.isLoading && !isOpen && (
          <Badge colorScheme="purple" fontSize="16px" position="absolute" top="-13px" left="-20px">
            + {points} points
          </Badge>
        )}
        <Skeleton w={race.isLoading ? '177px' : undefined} isLoaded={!race.isLoading}>
          <Image height="100px" alt="race" src={race.data?.image || undefined} />
        </Skeleton>
        <Flex flexDir="column">
          <SkeletonText isLoaded={!race.isLoading}>
            <Heading fontWeight="normal">{race.data?.name || 'The name of the race'}</Heading>
            <Text>{race.data?.circuit}</Text>
            <Text>{race.data?.startsAt ? DateTime.fromJSDate(race.data?.startsAt).toRelative() : null}</Text>
            <Badge variant="outline" colorScheme={isOpen ? 'green' : 'red'} px={2}>
              {isOpen ? 'Open' : 'Closed'}
            </Badge>
          </SkeletonText>
        </Flex>
      </Flex>
      <Flex gap={10} flexDir={{ base: 'column', md: 'row' }} justifyContent="space-around">
        <Flex alignItems="center" gap={2} flexDir="column" position="relative">
          {!isOpen && !race.isLoading && !racebet.isLoading && (
            <Badge
              boxShadow="md"
              variant="solid"
              position="absolute"
              top="-5px"
              left="-10px"
              colorScheme={isFirstOk ? 'green' : 'red'}
            >
              {isFirstOk ? 'CORRECT +2' : 'WRONG'}
            </Badge>
          )}
          <Skeleton isLoaded={!racebet.isLoading}>
            <Image
              alt="image"
              width="200px"
              fallbackSrc="https://via.placeholder.com/200"
              src={firstDriver?.image || undefined}
            />
          </Skeleton>
          <Flex alignItems="center" gap={2} w="100%">
            <Text fontWeight="bold">1st</Text>
            <Select
              value={racebet.data?.firstPlaceDriverId || undefined}
              disabled={upsertBet.isLoading || !isOpen}
              onChange={onChangeFirstDriver}
            >
              <option value="">choose a driver</option>
              {drivers.data?.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </Select>
          </Flex>
          <Skeleton isLoaded={!upsertBet.isLoading} w="100%">
            <Flex
              alignItems="center"
              border="1px solid"
              borderColor="gray.200"
              w="100%"
              justifyContent="center"
              position="relative"
            >
              {!isOpen && !race.isLoading && !racebet.isLoading && (
                <Badge
                  boxShadow="md"
                  variant="solid"
                  position="absolute"
                  top="-5px"
                  left="-10px"
                  colorScheme={isFirstTeamOk ? 'green' : 'red'}
                >
                  {isFirstTeamOk ? 'CORRECT +1' : 'WRONG'}
                </Badge>
              )}
              <Image
                alt="team"
                height="50px"
                src={
                  firstDriver?.raceTeamId
                    ? (teamsById[firstDriver?.raceTeamId] || {}).image || undefined
                    : undefined
                }
                fallbackSrc="https://via.placeholder.com/50"
              />
              <Text>{firstDriver?.raceTeamId ? (teamsById[firstDriver?.raceTeamId] || {}).name : null}</Text>
            </Flex>
          </Skeleton>
        </Flex>
        <Flex alignItems="center" gap={2} flexDir="column" position="relative">
          {!isOpen && !race.isLoading && !racebet.isLoading && (
            <Badge
              boxShadow="md"
              variant="solid"
              position="absolute"
              top="-5px"
              left="-10px"
              colorScheme={isSecondOk ? 'green' : 'red'}
            >
              {isSecondOk ? 'CORRECT +2' : 'WRONG'}
            </Badge>
          )}
          <Skeleton isLoaded={!racebet.isLoading}>
            <Image
              alt="image"
              width="200px"
              fallbackSrc="https://via.placeholder.com/200"
              src={secondDriver?.image || undefined}
            />
          </Skeleton>
          <Flex alignItems="center" gap={2} w="100%">
            <Text fontWeight="bold">2nd</Text>
            <Select
              value={racebet.data?.secondPlaceDriverId || undefined}
              disabled={upsertBet.isLoading || !isOpen}
              onChange={onChangeSecondDriver}
            >
              <option value="">choose a driver</option>
              {drivers.data?.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </Select>
          </Flex>
          <Skeleton isLoaded={!upsertBet.isLoading} w="100%">
            <Flex
              alignItems="center"
              border="1px solid"
              borderColor="gray.200"
              w="100%"
              justifyContent="center"
              position="relative"
            >
              {!isOpen && !race.isLoading && !racebet.isLoading && (
                <Badge
                  boxShadow="md"
                  variant="solid"
                  position="absolute"
                  top="-5px"
                  left="-10px"
                  colorScheme={isSecondTeamOk ? 'green' : 'red'}
                >
                  {isSecondTeamOk ? 'CORRECT +1' : 'WRONG'}
                </Badge>
              )}
              <Image
                alt="team"
                height="50px"
                src={
                  secondDriver?.raceTeamId
                    ? (teamsById[secondDriver?.raceTeamId] || {}).image || undefined
                    : undefined
                }
                fallbackSrc="https://via.placeholder.com/50"
              />
              <Text>
                {secondDriver?.raceTeamId ? (teamsById[secondDriver?.raceTeamId] || {}).name : null}
              </Text>
            </Flex>
          </Skeleton>
        </Flex>
        <Flex alignItems="center" gap={2} flexDir="column" position="relative">
          {!isOpen && !race.isLoading && !racebet.isLoading && (
            <Badge
              boxShadow="md"
              variant="solid"
              position="absolute"
              top="-5px"
              left="-10px"
              colorScheme={isThirdOk ? 'green' : 'red'}
            >
              {isThirdOk ? 'CORRECT +2' : 'WRONG'}
            </Badge>
          )}
          <Skeleton isLoaded={!racebet.isLoading}>
            <Image
              alt="image"
              width="200px"
              fallbackSrc="https://via.placeholder.com/200"
              src={thirdDriver?.image || undefined}
            />
          </Skeleton>
          <Flex alignItems="center" gap={2} w="100%">
            <Text fontWeight="bold">3rd</Text>
            <Select
              value={racebet.data?.thirdPlaceDriverId || undefined}
              disabled={upsertBet.isLoading || !isOpen}
              onChange={onChangeThirdDriver}
            >
              <option value="">choose a driver</option>
              {drivers.data?.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </Select>
          </Flex>
          <Skeleton isLoaded={!upsertBet.isLoading} w="100%">
            <Flex
              alignItems="center"
              border="1px solid"
              borderColor="gray.200"
              w="100%"
              justifyContent="center"
              position="relative"
            >
              {!isOpen && !race.isLoading && !racebet.isLoading && (
                <Badge
                  boxShadow="md"
                  variant="solid"
                  position="absolute"
                  top="-5px"
                  left="-10px"
                  colorScheme={isThirdTeamOk ? 'green' : 'red'}
                >
                  {isThirdTeamOk ? 'CORRECT +1' : 'WRONG'}
                </Badge>
              )}
              <Image
                alt="team"
                height="50px"
                src={
                  thirdDriver?.raceTeamId
                    ? (teamsById[thirdDriver?.raceTeamId] || {}).image || undefined
                    : undefined
                }
                fallbackSrc="https://via.placeholder.com/50"
              />
              <Text>{thirdDriver?.raceTeamId ? (teamsById[thirdDriver?.raceTeamId] || {}).name : null}</Text>
            </Flex>
          </Skeleton>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Race
