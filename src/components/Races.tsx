import { Badge, Flex, Heading, Image, Text, Button, Spacer, Skeleton } from '@chakra-ui/react'
import { DateTime } from 'luxon'

import { getPoints } from 'utils/race'
import { trpc, TRPC_Racebet } from 'utils/trpc'

import CustomLink from './CustomLink'

interface Props {
  tournamentId: string
}

const Races = ({ tournamentId }: Props) => {
  const { prefetchQuery } = trpc.useContext()
  const tournament = trpc.useQuery(['tournament.getOne', tournamentId])
  const races = trpc.useQuery(['race.getAll', tournamentId], {
    onSuccess() {
      prefetchQuery(['racedriver.getAll'])
      prefetchQuery(['tournament.getOne', tournamentId])
    },
  })
  const racebets = trpc.useQuery(['racebet.getAllByMeAndTournamentId', tournamentId])
  const racebetsByRaceId =
    racebets.data?.reduce<Record<string, TRPC_Racebet>>((byId, racebet) => {
      if (!byId[racebet.raceId]) {
        byId[racebet.raceId] = racebet
      }

      return byId
    }, {}) || {}

  return (
    <Flex flexDir="column" gap={4}>
      <Heading fontWeight="light" textTransform="capitalize">
        <CustomLink href="/">Tournaments</CustomLink> / {tournament.data?.name}
      </Heading>
      <Flex flexWrap="wrap" gap={5}>
        {races.isLoading && (
          <>
            <Skeleton isLoaded={!races.isLoading} boxShadow="md" borderTopRadius="10px">
              <Button p="0" w="unset" h="unset" variant="ghost" borderTopRadius="10px">
                <Flex height={{ base: 'unset', md: '237px' }} w={{ base: '100%', md: '340px' }} />
              </Button>
            </Skeleton>
            <Skeleton isLoaded={!races.isLoading} boxShadow="md" borderTopRadius="10px">
              <Button p="0" w="unset" h="unset" variant="ghost" borderTopRadius="10px">
                <Flex height={{ base: 'unset', md: '237px' }} w={{ base: '100%', md: '340px' }} />
              </Button>
            </Skeleton>
          </>
        )}
        {races.data?.map((race) => {
          const isOpen = race?.startsAt ? (race?.startsAt > new Date() ? true : false) : false
          const { points } = getPoints(race, racebetsByRaceId[race.id])

          return (
            <Button
              key={race.id}
              as={CustomLink}
              p="0"
              w="unset"
              h="unset"
              href={`/tournaments/${tournamentId}/race/${race.id}`}
              variant="ghost"
              borderTopRadius="10px"
              position="relative"
            >
              {!isOpen && (
                <Badge
                  colorScheme="purple"
                  position="absolute"
                  top="-5px"
                  left="-5px"
                  px={2}
                  variant="solid"
                  fontSize="16px"
                >
                  {'+ '}
                  {points}
                </Badge>
              )}
              <Flex key={race.id} flexDir="column" boxShadow="md">
                <Image
                  height={{ base: 'unset', md: '200px' }}
                  w={{ base: '100%', md: '340px' }}
                  alt="image"
                  src={race.image || undefined}
                  borderTopRadius="10px"
                />
                <Flex alignItems="center" borderBottom="5px solid" borderColor="purple.600">
                  <Text fontSize="18px" p={2}>
                    {race.name}
                  </Text>
                  <Badge colorScheme={isOpen ? 'green' : 'red'} variant="outline" py={1} px={3}>
                    {isOpen ? 'open' : 'closed'}
                  </Badge>
                  <Spacer />
                  <Text fontWeight="light" px={2}>
                    {DateTime.fromJSDate(race.startsAt).toRelative()}
                  </Text>
                </Flex>
              </Flex>
            </Button>
          )
        })}
      </Flex>
    </Flex>
  )
}

export default Races
