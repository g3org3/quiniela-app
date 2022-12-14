import { Avatar, Button, Flex, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import CustomLink from 'components/CustomLink'
import { trpc } from 'utils/trpc'

const Group = () => {
  const router = useRouter()
  const { groupId, tournamentId } = router.query as { groupId: string; tournamentId: string }
  const tournament = trpc.useQuery(['tournament.getOne', tournamentId])
  const group = trpc.useQuery(['group.getOne', groupId])
  const leaderboard = trpc.useQuery(['bet.getAllByGroupIdAndToId', { groupId, tournamentId }])

  return (
    <Flex flexDir="column" gap={5}>
      <Heading fontWeight="light" textTransform="capitalize">
        <CustomLink href={`/tournaments/${tournament.data?.id}`}>{tournament.data?.name}</CustomLink> /{' '}
        {group.data?.name} - Bets
      </Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Pos</Th>
            <Th>User</Th>
            <Th>Points</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {leaderboard.data?.map((lb, index) => {
            return (
              <Tr key={lb.id}>
                <Td>{index + 1}</Td>
                <Td>
                  <Flex alignItems="center" gap={2}>
                    <Avatar name={lb.name || undefined} src={lb?.image || undefined} size="sm" />
                    {lb.name}
                  </Flex>
                </Td>
                <Td>{lb.points}</Td>
                <Td>
                  <Button
                    as={CustomLink}
                    href={`/tournaments/${tournament.data?.id}/groups/${groupId}/users/${lb.id}`}
                  >
                    view bets
                  </Button>
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Flex>
  )
}

export default Group
