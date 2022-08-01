import { Flex, Heading, Image, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import CustomLink from 'components/CustomLink'
import { DateTime } from 'luxon'

import { trpc } from 'utils/trpc'

interface Props {
  tournamentId: string
}

const Races = ({ tournamentId }: Props) => {
  const races = trpc.useQuery(['race.getAll', tournamentId])

  return (
    <Flex flexDir="column" w="50%">
      <Heading fontWeight="normal">Races</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>When</Th>
          </Tr>
        </Thead>
        <Tbody>
          {races.data?.map((race) => (
            <Tr key={race.id}>
              <Td>
                <Flex alignItems="center" gap={2}>
                  <CustomLink href={`/admin/tournaments/${tournamentId}/race/${race.id}`}>
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
