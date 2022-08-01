import { Flex, Heading, Image, Select, Skeleton, SkeletonText, Text, useToast } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import CustomLink from 'components/CustomLink'
import { trpc, TRPC_Driver, TRPC_Raceteam } from 'utils/trpc'

interface Props {
  //
}

const Race = (_: Props) => {
  useSession({ required: true })
  const router = useRouter()
  const toast = useToast()
  const raceId = router.query.raceId as string
  const tournamentId = router.query.tournamentId as string

  const race = trpc.useQuery(['race.getOne', raceId])
  const drivers = trpc.useQuery(['racedriver.getAll'])
  const tournament = trpc.useQuery(['tournament.getOne', tournamentId])
  const racebet = trpc.useQuery(['racebet.getOneByRaceId', raceId])


  // TODO: infer the specific key firstDriver of a type
  const [firstDriver, setFirstDriver] = useState<TRPC_Driver | null>(racebet.data?.firstPlaceDriver as TRPC_Driver)
  const [secondDriver, setSecondDriver] = useState<TRPC_Driver | null>(racebet.data?.secondPlaceDriver as TRPC_Driver)
  const [thirdDriver, setThirdDriver] = useState<TRPC_Driver | null>(racebet.data?.thirdPlaceDriver as TRPC_Driver)

  const upsertBet = trpc.useMutation('racebet.upsert', {
    onSuccess() {
      toast({ variant: 'left-accent', title: 'updated', status: 'success' })
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

  return (
    <Flex flexDir="column" gap={10}>
      <Heading fontWeight="normal" textTransform="capitalize">
        <CustomLink href={`/tournaments/${tournamentId}/race`}>{tournament.data?.name || 'Races'}</CustomLink>{' '}
        / {race.data?.name}
      </Heading>
      <Flex gap={2} borderTop="1px solid" borderBottom="1px solid" borderColor="gray.200" alignItems="center">
        <Skeleton w={race.isLoading ? '177px' : undefined} isLoaded={!race.isLoading}>
          <Image height="100px" alt="race" src={race.data?.image || undefined} />
        </Skeleton>
        <Flex flexDir="column">
          <SkeletonText isLoaded={!race.isLoading}>
            <Heading fontWeight="normal">{race.data?.name || 'The name of the race'}</Heading>
            <Text>{race.data?.circuit}</Text>
          </SkeletonText>
        </Flex>
      </Flex>
      <Flex gap={10}>
        <Flex alignItems="center" gap={2} flexDir="column">
          <Image
            alt="image"
            width="200px"
            fallbackSrc="https://via.placeholder.com/200"
            src={firstDriver?.image || undefined}
          />
          <Flex alignItems="center" gap={2}>
            <Text>1st</Text>
            <Select disabled={upsertBet.isLoading} onChange={onChangeFirstDriver}>
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
            >
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
        <Flex alignItems="center" gap={2} flexDir="column">
          <Image
            alt="image"
            width="200px"
            fallbackSrc="https://via.placeholder.com/200"
            src={secondDriver?.image || undefined}
          />
          <Flex alignItems="center" gap={2}>
            <Text>2nd</Text>
            <Select disabled={upsertBet.isLoading} onChange={onChangeSecondDriver}>
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
            >
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
        <Flex alignItems="center" gap={2} flexDir="column">
          <Image
            alt="image"
            width="200px"
            fallbackSrc="https://via.placeholder.com/200"
            src={thirdDriver?.image || undefined}
          />
          <Flex alignItems="center" gap={2}>
            <Text>3rd</Text>
            <Select disabled={upsertBet.isLoading} onChange={onChangeThirdDriver}>
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
            >
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
