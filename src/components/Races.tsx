import { Flex, Heading, Image, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
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
    <Flex flexDir="column" w="50%">
      <Heading fontWeight="normal" textTransform="capitalize">
        {tournament.data?.name}
      </Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>When</Th>
            <Th>Status</Th>
            <Th>Points</Th>
          </Tr>
        </Thead>
        <Tbody>
          {races.data?.map((race) => (
            <Tr key={race.id}>
              <Td>
                <Flex alignItems="center" gap={2}>
                  <CustomLink href={`/tournaments/${tournamentId}/race/${race.id}`}>
                    <>
                      <Image alt="team logo" h="50px" src={race.image || undefined} />
                      {race.name}
                    </>
                  </CustomLink>
                </Flex>
              </Td>
              <Td>
                {DateTime.fromJSDate(race.startsAt).toFormat('yyyy-MM-dd HH:mm')} (
                {DateTime.fromJSDate(race.startsAt).toRelative()})
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  )
}

export default Races
