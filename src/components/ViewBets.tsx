import { Avatar, Flex, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'

import { getPoints } from 'utils/race'
import { trpc } from 'utils/trpc'

interface Props {
  raceId: string
  isOpen?: boolean
  race: any
}

const ViewBets = ({ race, raceId, isOpen }: Props) => {
  const racebets = trpc.useQuery(['racebet.getAllByRaceId', raceId])

  return (
    <>
      <Heading fontWeight="light">Bets</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>User</Th>
            <Th>1st Place</Th>
            <Th>2nd Place</Th>
            <Th>3rd Place</Th>
            <Th>Points</Th>
          </Tr>
        </Thead>
        <Tbody>
          {racebets.data?.map((racebet) => {
            const { points } = getPoints(race, racebet)

            return (
              <Tr key={racebet.id}>
                <Td>
                  <Flex alignItems="center" gap={2}>
                    <Avatar
                      name={racebet.User.name || undefined}
                      src={racebet.User?.image || undefined}
                      size="sm"
                    />
                    {racebet.User.name}
                  </Flex>
                </Td>
                <Td>{isOpen ? '******' : racebet.firstPlaceDriver?.name}</Td>
                <Td>{isOpen ? '******' : racebet.secondPlaceDriver?.name}</Td>
                <Td>{isOpen ? '******' : racebet.thirdPlaceDriver?.name}</Td>
                <Td>{isOpen ? '******' : points}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </>
  )
}

export default ViewBets
