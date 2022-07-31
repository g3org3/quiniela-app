import { Button, Flex, Image, Input, Spacer, useToast } from '@chakra-ui/react'
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
      <Flex flexWrap="wrap" gap={5}>
        {matches.data?.map((match) => (
          <Flex key={match.id} p={3} boxShadow="md" flexDir="column" gap={2}>
            <Flex gap={2}>
              <Flex w="50%" flexDir="column" alignItems="flex-start">
                <Image alt="flag" height="50px" fallbackSrc="https://via.placeholder.com/50" />
                {match.homeTeam}
                <Input size="sm" type="number" />
              </Flex>
              <Flex w="50%" flexDir="column" alignItems="flex-start">
                <Image alt="flag" height="50px" fallbackSrc="https://via.placeholder.com/50" />
                {match.awayTeam}
                <Input size="sm" type="number" />
              </Flex>
            </Flex>
            <Flex>
              {match.location} <Spacer />
              {DateTime.fromJSDate(match.startsAt).toRelative()}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </>
  )
}

export default Matches
