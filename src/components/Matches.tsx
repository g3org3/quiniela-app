import { Button, Select, Table, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react'
import { DateTime } from 'luxon'

import { trpc } from 'utils/trpc'

interface Props {
  tournamentId: string
  isAdmin?: boolean
}

const Matches = ({ tournamentId, isAdmin }: Props) => {
  const { invalidateQueries } = trpc.useContext()
  const toast = useToast()
  const matches = trpc.useQuery(['match.getAllByTournamentId', tournamentId])

  const phases = matches.data
    ? Array.from(new Set(matches.data.map((match) => match.phase).filter(Boolean))).sort()
    : []

  return (
    <>
      <Select>
        <option value="">-</option>
        {phases.map((phase) => (
          <option key={phase}>{phase}</option>
        ))}
      </Select>
      <Table>
        <Thead>
          <Tr>
            <Th>home</Th>
            <Th>away</Th>
            <Th>match date</Th>
            <Th>status</Th>
            <Th>action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {matches.data?.map((match) => (
            <Tr key={match.id}>
              <Td>{match.homeTeam}</Td>
              <Td>{match.awayTeam}</Td>
              <Td>{DateTime.fromJSDate(match.startsAt).toRelative()}</Td>
              <Td>{match.location}</Td>
              <Td>
                <Button colorScheme="purple" variant="outline" size="sm">
                  bet
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  )
}

export default Matches
