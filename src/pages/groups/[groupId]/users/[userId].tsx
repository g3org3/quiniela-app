import { Text, Flex, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import CustomLink from 'components/CustomLink'
import { getPoints } from 'utils/race'
import { trpc } from 'utils/trpc'

interface Props {
  raceId: string
  isOpen?: boolean
  race: any
}

const UserIdBets = ({ race, raceId, isOpen }: Props) => {
  const router = useRouter()
  const groupId = router.query.groupId as string
  const userId = router.query.userId as string
  const group = trpc.useQuery(['group.getOne', groupId])
  const user = trpc.useQuery(['user.getOne', userId])
  const history = trpc.useQuery(['racebet.getAllByUserId', userId])

  return (
    <Flex flexDir="column" pt={5} gap={5}>
      <Heading fontWeight="light" textTransform="capitalize">
        <CustomLink href="/groups">Groups</CustomLink> /{' '}
        <CustomLink href={`/groups/${groupId}`}>{group.data?.name} - Bets</CustomLink> / {user.data?.name}
      </Heading>
      <Table>
        <Thead>
          <Tr>
            <Th colSpan={2} borderRight="1px solid #eee">
              <Flex flexDir="column" textAlign="center">
                <Text>1st Place</Text>
                <Flex>
                  <Text flex="1" textAlign="center">
                    Bet
                  </Text>
                  <Text flex="1" textAlign="center">
                    Actual
                  </Text>
                </Flex>
              </Flex>
            </Th>
            <Th colSpan={2} borderRight="1px solid #eee">
              <Flex flexDir="column" textAlign="center">
                <Text>2nd Place</Text>
                <Flex>
                  <Text flex="1" textAlign="center">
                    Bet
                  </Text>
                  <Text flex="1" textAlign="center">
                    Actual
                  </Text>
                </Flex>
              </Flex>
            </Th>
            <Th colSpan={2} borderRight="1px solid #eee">
              <Flex flexDir="column" textAlign="center">
                <Text>3rd Place</Text>
                <Flex>
                  <Text flex="1" textAlign="center">
                    Bet
                  </Text>
                  <Text flex="1" textAlign="center">
                    Actual
                  </Text>
                </Flex>
              </Flex>
            </Th>
            <Th>Points</Th>
          </Tr>
        </Thead>
        <Tbody>
          {history.data?.bets.map((racebet, i) => {
            const race = history.data.races[i]
            const { points, isFirstOk, isFirstTeamOk, isSecondOk, isSecondTeamOk, isThirdOk, isThirdTeamOk } =
              getPoints(race, racebet)
            const isOpen = race?.startsAt && race?.startsAt.getTime() > Date.now()

            const points1 = isFirstOk && isFirstTeamOk ? '+3' : isFirstTeamOk ? ' +1' : ''
            const points2 = isSecondOk && isSecondTeamOk ? '+3' : isSecondTeamOk ? ' +1' : ''
            const points3 = isThirdOk && isThirdTeamOk ? ' +3' : isThirdTeamOk ? ' +1' : ''

            return (
              <Tr key={racebet.id}>
                <Td>{isOpen ? '******' : racebet.firstPlaceDriver?.name + points1}</Td>
                <Td bg="gray.100" color="gray.400" borderRight="1px solid #eee">
                  {isOpen ? '******' : race?.firstPlaceDriver?.name}
                </Td>
                <Td>{isOpen ? '******' : racebet.secondPlaceDriver?.name + points2}</Td>
                <Td bg="gray.100" color="gray.400" borderRight="1px solid #eee">
                  {isOpen ? '******' : race?.secondPlaceDriver?.name}
                </Td>
                <Td>{isOpen ? '******' : racebet.thirdPlaceDriver?.name + points3}</Td>
                <Td bg="gray.100" color="gray.400" borderRight="1px solid #eee">
                  {isOpen ? '******' : race?.thirdPlaceDriver?.name}
                </Td>
                <Td>{isOpen ? '******' : points}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Flex>
  )
}

export default UserIdBets
