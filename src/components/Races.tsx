import { Badge, Flex, Heading, Image, Text, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { DateTime } from 'luxon'

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
        {races.data?.map((race) => (
          <CustomLink href={`/tournaments/${tournamentId}/race/${race.id}`}>
            <Flex key={race.id} flexDir="column" boxShadow="md">
              <Image height="100px" alt="image" src={race.image || undefined} />
              <Text p={2}>{race.name}</Text>
            </Flex>
          </CustomLink>
        ))}
      </Flex>
    </Flex>
  )
}

export default Races
