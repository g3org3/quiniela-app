import { Flex, Heading, Image, Select, Skeleton, SkeletonText, Text } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import CustomLink from 'components/CustomLink'
import { trpc } from 'utils/trpc'

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
  const myDrivers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  const isOpen = race.data?.startsAt?.getTime() || 0 > Date.now()

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
      <Flex flexDir="column" gap={2} maxW="400px">
        {myDrivers.map((driverId, index) => (
          <Flex key={driverId} alignItems="center" gap={2}>
            <Text fontFamily="monospace" fontSize="20px">
              {index < 9 ? `0${index + 1}` : index + 1}
            </Text>
            <Select>
              <option value="">choose a driver</option>
              {drivers.data?.map((driver) => (
                <option key={driver.id}>{driver.name}</option>
              ))}
            </Select>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

export default Race
