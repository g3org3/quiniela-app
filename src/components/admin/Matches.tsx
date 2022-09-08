import { Button, Table, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react'
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
          <Tr>
            <Th>home</Th>
            <Th>score</Th>
            <Th>away</Th>
            <Th>score</Th>
            <Th>start at</Th>
            <Th>location</Th>
            <Th>phase</Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {matches.data?.map((match) => (
            <Tr key={match.id}>
              <Td>{match.homeTeam}</Td>
              <Td>{match.homeTeamScore}</Td>
              <Td>{match.awayTeam}</Td>
              <Td>{match.awayTeamScore}</Td>
              <Td title={DateTime.fromJSDate(match.startsAt).toFormat('yyyy-MM-dd HH:mm')}>
                {DateTime.fromJSDate(match.startsAt).toRelative()}
              </Td>
              <Td>{match.location}</Td>
              <Td>{match.phase}</Td>
              <Td>
                {isAdmin && (
                  <Button
                    isDisabled={delMatch.isLoading}
                    isLoading={delMatch.isLoading}
                    onClick={onClickDel(match.id)}
                    colorScheme="purple"
                    variant="outline"
                    size="sm"
                  >
                    view
                  </Button>
                )}
              </Td>
              <Td>
                {isAdmin && (
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
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  )
}

export default Matches
