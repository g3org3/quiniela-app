import { Avatar, Flex, Heading, Table, Tbody, Td, Th, Thead, Tr, Text } from '@chakra-ui/react'
import { Race, RaceDriver } from '@prisma/client'

import { getPoints } from 'utils/race'
import { trpc } from 'utils/trpc'

interface Props {
  raceId: string
  isOpen?: boolean
  race?:
    | (Race & {
        firstPlaceDriver: RaceDriver | null
        secondPlaceDriver: RaceDriver | null
        thirdPlaceDriver: RaceDriver | null
      })
    | null
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
            <Th>
              <Flex flexDir="column">
                <Text>1st Place</Text>
                <Text> {race?.firstPlaceDriver?.name}</Text>
              </Flex>
            </Th>
            <Th>
              <Flex flexDir="column">
                <Text>2nd Place</Text>
                <Text> {race?.secondPlaceDriver?.name}</Text>
              </Flex>
            </Th>
            <Th>
              <Flex flexDir="column">
                <Text>3rd Place</Text>
                <Text> {race?.thirdPlaceDriver?.name}</Text>
              </Flex>
            </Th>
            <Th>Points</Th>
          </Tr>
        </Thead>
        <Tbody>
          {racebets.data?.map((racebet) => {
            const { points, isFirstOk, isFirstTeamOk, isSecondOk, isSecondTeamOk, isThirdOk, isThirdTeamOk } =
              getPoints(race, racebet)

            const points1 = isFirstOk && isFirstTeamOk ? '+3' : isFirstTeamOk ? ' +1' : ''
            const points2 = isSecondOk && isSecondTeamOk ? '+3' : isSecondTeamOk ? ' +1' : ''
            const points3 = isThirdOk && isThirdTeamOk ? ' +3' : isThirdTeamOk ? ' +1' : ''

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
                <Td>{isOpen ? '******' : racebet.firstPlaceDriver?.name + points1}</Td>
                <Td>{isOpen ? '******' : racebet.secondPlaceDriver?.name + points2}</Td>
                <Td>{isOpen ? '******' : racebet.thirdPlaceDriver?.name + points3}</Td>
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
