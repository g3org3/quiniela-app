import {
  Badge,
  Flex,
  Heading,
  Image,
  Select,
  Skeleton,
  SkeletonText,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import CustomLink from 'components/CustomLink'
import ViewBets from 'components/ViewBets'
import { getPoints } from 'utils/race'
import { trpc, TRPC_Driver, TRPC_Raceteam } from 'utils/trpc'

interface Props {
  //
}

// TODO: make a driver choose component
// TODO: view other bets maybe in the admin
// TODO: driver placeholder
// TODO: refactor function to get points

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

  const [firstDriver, setFirstDriver] = useState<TRPC_Driver>()
  const [secondDriver, setSecondDriver] = useState<TRPC_Driver>()
  const [thirdDriver, setThirdDriver] = useState<TRPC_Driver>()

  useEffect(() => {
    setFirstDriver(racebet.data?.firstPlaceDriver)
  }, [racebet.data?.firstPlaceDriverId])

  useEffect(() => {
    setSecondDriver(racebet.data?.secondPlaceDriver)
  }, [racebet.data?.secondPlaceDriverId])

  useEffect(() => {
    setThirdDriver(racebet.data?.thirdPlaceDriver)
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
  const teamsWDriversByTeamId: Record<string, { team: TRPC_Raceteam; drivers: TRPC_Driver[] }> = {}
  const driversById =
    drivers.data?.reduce<Record<string, TRPC_Driver>>((_byId, driver) => {
      if (_byId[driver.id]) return _byId
      _byId[driver.id] = driver
      if (driver.raceTeamId && driver.raceteam) {
        teamsById[driver.raceTeamId] = driver.raceteam
        if (!teamsWDriversByTeamId[driver.raceTeamId]) {
          teamsWDriversByTeamId[driver.raceTeamId] = { team: driver.raceteam, drivers: [] }
        }
        teamsWDriversByTeamId[driver.raceTeamId]?.drivers.push(driver)
      }

      return _byId
    }, {}) || {}

  const onChangeFirstDriver: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const driver = driversById[e.target.value] || null
    const driverId = driver?.id || null
    setFirstDriver(driver)
    upsertBet.mutate({ firstPlaceDriverId: driverId, raceId })
  }
  const onChangeSecondDriver: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const driver = driversById[e.target.value] || null
    const driverId = driver?.id || null
    setSecondDriver(driver)
    upsertBet.mutate({ secondPlaceDriverId: driverId, raceId })
  }
  const onChangeThirdDriver: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const driver = driversById[e.target.value] || null
    const driverId = driver?.id || null
    setThirdDriver(driver)
    upsertBet.mutate({ thirdPlaceDriverId: driverId, raceId })
  }

  const isOpen = race.data?.startsAt ? (race.data?.startsAt > new Date() ? true : false) : false

  const { points, isFirstOk, isFirstTeamOk, isSecondOk, isSecondTeamOk, isThirdOk, isThirdTeamOk } =
    getPoints(race.data, racebet.data)

  return (
    <Flex flexDir="column" gap={10} pb={10}>
      <Heading fontWeight="light" textTransform="capitalize">
        <CustomLink href="/">Tournaments</CustomLink> /{' '}
        <CustomLink href={`/tournaments/${tournamentId}/race`}>{tournament.data?.name || 'Races'}</CustomLink>
      </Heading>
      <Flex
        gap={2}
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        alignItems="center"
        position="relative"
      >
        {!race.isLoading && !racebet.isLoading && !isOpen && (
          <Badge
            colorScheme="purple"
            variant="solid"
            fontSize="16px"
            position="absolute"
            top="-13px"
            left="-20px"
          >
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
              fallback={<Flex h="200px" w="200px" bg="whitesmoke"></Flex>}
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
              {Object.values(teamsWDriversByTeamId).map((t) => (
                <>
                  <option value="">-- {t.team.name} --</option>
                  {t.drivers.map((driver) => (
                    <option key={driver?.id} value={driver?.id}>
                      {driver?.name}
                    </option>
                  ))}
                </>
              ))}
            </Select>
          </Flex>
          <Skeleton isLoaded={!upsertBet.isLoading && !race.isLoading && !racebet.isLoading} w="100%">
            <Flex
              alignItems="center"
              border="1px solid"
              borderColor="gray"
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
                fallback={<Flex h="50px" w="50px"></Flex>}
                src={
                  firstDriver?.raceTeamId
                    ? (teamsById[firstDriver?.raceTeamId] || {}).image || undefined
                    : undefined
                }
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
              fallback={<Flex h="200px" w="200px" bg="whitesmoke"></Flex>}
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
              {Object.values(teamsWDriversByTeamId).map((t) => (
                <>
                  <option value="">-- {t.team.name} --</option>
                  {t.drivers.map((driver) => (
                    <option key={driver?.id} value={driver?.id}>
                      {driver?.name}
                    </option>
                  ))}
                </>
              ))}
            </Select>
          </Flex>
          <Skeleton w="100%" isLoaded={!upsertBet.isLoading && !race.isLoading && !racebet.isLoading}>
            <Flex
              alignItems="center"
              border="1px solid"
              borderColor="gray"
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
                fallback={<Flex h="50px" w="50px"></Flex>}
                src={
                  secondDriver?.raceTeamId
                    ? (teamsById[secondDriver?.raceTeamId] || {}).image || undefined
                    : undefined
                }
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
              fallback={<Flex h="200px" w="200px" bg="whitesmoke"></Flex>}
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
              {Object.values(teamsWDriversByTeamId).map((t) => (
                <>
                  <option value="">-- {t.team.name} --</option>
                  {t.drivers.map((driver) => (
                    <option key={driver?.id} value={driver?.id}>
                      {driver?.name}
                    </option>
                  ))}
                </>
              ))}
            </Select>
          </Flex>
          <Skeleton isLoaded={!upsertBet.isLoading && !race.isLoading && !racebet.isLoading} w="100%">
            <Flex
              alignItems="center"
              border="1px solid"
              borderColor="gray"
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
                fallback={<Flex h="50px" w="50px"></Flex>}
                src={
                  thirdDriver?.raceTeamId
                    ? (teamsById[thirdDriver?.raceTeamId] || {}).image || undefined
                    : undefined
                }
              />
              <Text>{thirdDriver?.raceTeamId ? (teamsById[thirdDriver?.raceTeamId] || {}).name : null}</Text>
            </Flex>
          </Skeleton>
        </Flex>
      </Flex>
      <ViewBets raceId={raceId} race={race.data} isOpen={isOpen} />
    </Flex>
  )
}

export default Race
