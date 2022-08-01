import { Badge, Flex, Heading, Image, Text, Button } from '@chakra-ui/react'

import { trpc } from 'utils/trpc'

import CustomLink from './CustomLink'

interface Props {
  tournamentId: string
}

const Races = ({ tournamentId }: Props) => {
  const races = trpc.useQuery(['race.getAll', tournamentId])
  const tournament = trpc.useQuery(['tournament.getOne', tournamentId])

  return (
    <Flex flexDir="column" gap={4}>
      <Heading fontWeight="normal" textTransform="capitalize">
        {tournament.data?.name}
      </Heading>
      <Flex flexWrap="wrap" gap={5}>
        {races.data?.map((race) => {
          const isOpen = race?.startsAt ? (race?.startsAt > new Date() ? true : false) : false

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
            >
              <Flex key={race.id} flexDir="column" boxShadow="md">
                <Image height="200px" alt="image" src={race.image || undefined} borderTopRadius="10px" />
                <Flex alignItems="center">
                  <Text fontSize="18px" p={2}>
                    {race.name}
                  </Text>
                  <Badge colorScheme={isOpen ? 'green' : 'red'} variant="outline" py={1} px={3}>
                    {isOpen ? 'open' : 'closed'}
                  </Badge>
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
