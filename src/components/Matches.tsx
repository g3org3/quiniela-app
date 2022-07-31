import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { useRouter } from 'next/router'

import { trpc } from 'utils/trpc'

interface Props {
  //
}

const Matches = (_: Props) => {
  const router = useRouter()
  const { tournamentId } = router.query
  const matches = trpc.useQuery(['match.getAllByTournamentId', tournamentId as string])

  return (
    <>
      <Table>
        <Thead>
          <Th>home</Th>
          <Th>score</Th>
          <Th>away</Th>
          <Th>score</Th>
          <Th>start at</Th>
          <Th>status</Th>
          <Th>location</Th>
          <Th>phase</Th>
        </Thead>
        <Tbody>
          {matches.data?.map((match) => (
            <Tr key={match.id}>
              <Td>{match.homeTeam}</Td>
              <Td>{match.homeTeamScore}</Td>
              <Td>{match.awayTeam}</Td>
              <Td>{match.awayTeamScore}</Td>
              <Td>
                {DateTime.fromJSDate(match.startsAt).toFormat('yyyy-MM-dd HH:mm')} (
                {DateTime.fromJSDate(match.startsAt).toRelative()})
              </Td>
              <Td>{match.status}</Td>
              <Td>{match.location}</Td>
              <Td>{match.phase}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  )
}

export default Matches
