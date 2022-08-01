import { Flex, Heading, Image, Select, Skeleton, SkeletonText, Text } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import CustomLink from 'components/CustomLink'
import { trpc, TRPC_Driver } from 'utils/trpc'

interface Props {
  //
}

const Race = (_: Props) => {
  useSession({ required: true })
  const router = useRouter()
  const raceId = router.query.raceId as string
  const tournamentId = router.query.tournamentId as string
  const race = trpc.useQuery(['race.getOne', raceId])
  const drivers = trpc.useQuery(['racedriver.getAll'])
  const tournament = trpc.useQuery(['tournament.getOne', tournamentId])
  const [firstDriver, setFirstDriver] = useState<TRPC_Driver | null>(null)
  const [secondDriver, setSecondDriver] = useState<TRPC_Driver | null>(null)
  const [thirdDriver, setThirdDriver] = useState<TRPC_Driver | null>(null)

  const driversById =
    drivers.data?.reduce<Record<string, TRPC_Driver>>((_byId, driver) => {
      if (!_byId[driver.id]) {
        _byId[driver.id] = driver
      }

      return _byId
    }, {}) || {}

  const onChangeFirstDriver: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const driver = driversById[e.target.value]
    if (!driver) return
    setFirstDriver(driver)
  }
  const onChangeSecondDriver: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const driver = driversById[e.target.value]
    if (!driver) return
    setSecondDriver(driver)
  }
  const onChangeThirdDriver: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const driver = driversById[e.target.value]
    if (!driver) return
    setThirdDriver(driver)
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
            <Select onChange={onChangeFirstDriver}>
              <option value="">choose a driver</option>
              {drivers.data?.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </Select>
          </Flex>
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
              src={firstDriver?.raceteam.image || undefined}
              fallbackSrc="https://via.placeholder.com/50"
            />
            <Text>{firstDriver?.raceteam.name}</Text>
          </Flex>
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
            <Select onChange={onChangeSecondDriver}>
              <option value="">choose a driver</option>
              {drivers.data?.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </Select>
          </Flex>
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
              src={secondDriver?.raceteam.image || undefined}
              fallbackSrc="https://via.placeholder.com/50"
            />
            <Text>{secondDriver?.raceteam.name}</Text>
          </Flex>
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
            <Select onChange={onChangeThirdDriver}>
              <option value="">choose a driver</option>
              {drivers.data?.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </Select>
          </Flex>
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
              fallbackSrc="https://via.placeholder.com/50"
              src={thirdDriver?.raceteam.image || undefined}
            />
            <Text>{thirdDriver?.raceteam.name}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Race
