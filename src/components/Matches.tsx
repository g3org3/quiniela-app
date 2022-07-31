import { Button, Table, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { useRouter } from 'next/router'

import { trpc } from 'utils/trpc'

interface Props {
  //
}

const Matches = (_: Props) => {
  const router = useRouter()
  const { tournamentId } = router.query
  const { invalidateQueries } = trpc.useContext()
  const toast = useToast()
  const matches = trpc.useQuery(['match.getAllByTournamentId', tournamentId as string])
  const delMatch = trpc.useMutation('match.delete', {
    onSuccess: () => {
      invalidateQueries(['match.getAllByTournamentId'])
      toast({ variant: 'left-accent', title: 'Deleted', status: 'success' })
    },
    onError: (err) => {
      toast({
        variant: 'left-accent',
        title: 'Something went wrong',
        description: err.message,
        status: 'error',
      })
    },
  })
  const onClickDel = (id: string) => () => delMatch.mutate(id)

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
          <Th>Delete</Th>
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
              <Td>
                <Button
                  isDisabled={delMatch.isLoading}
                  isLoading={delMatch.isLoading}
                  onClick={onClickDel(match.id)}
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                >
                  delete
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
