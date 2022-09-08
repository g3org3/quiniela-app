import { Button, Flex, Image, Input, Spacer, useColorModeValue, useToast } from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { useRouter } from 'next/router'

import CustomLink from 'components/CustomLink'
import { trpc } from 'utils/trpc'

interface Props {
  tournamentId: string
  isAdmin?: boolean
}

const Matches = ({ tournamentId, isAdmin }: Props) => {
  const { invalidateQueries } = trpc.useContext()
  const toast = useToast()
  const matches = trpc.useQuery(['match.getAllByTournamentId', tournamentId])
  const gray = useColorModeValue('#eee', 'gray.700')

  const phases = matches.data
    ? Array.from(new Set(matches.data.map((match) => match.phase).filter(Boolean))).sort()
    : []

  return (
    <>
      <Flex flexWrap="wrap" gap={5}>
        {matches.data?.map((match) => (
          <Button
            as={CustomLink}
            borderRadius="0"
            borderTopRadius="10px"
            boxShadow="md"
            display="flex"
            flexDir="column"
            h="unset"
            href={`/tournaments/${tournamentId}/matches/${match.id}`}
            key={match.id}
            p="0"
            variant="ghost"
            border="1px solid"
            borderColor={gray}
            alignItems="stretch"
            w={{ base: '100%', md: '340px' }}
          >
            <Flex gap={2} p={3}>
              <Flex w="50%" flexDir="column" alignItems="center" justifyContent="center">
                <Image alt="flag" objectFit="cover" w="100px" h="100px" src={match.homeTeamImage || ''} />
                {match.homeTeam}
              </Flex>
              <Flex fontSize="xxx-large" alignItems="center" justifyContent="center">
                vs
              </Flex>
              <Flex w="50%" flexDir="column" alignItems="center" justifyContent="center">
                <Image alt="flag" objectFit="cover" w="100px" h="100px" src={match.awayTeamImage || ''} />
                {match.awayTeam}
              </Flex>
            </Flex>
            <Flex bg="blue.600" p={1} color="white" fontWeight="bold">
              {match.location} <Spacer />
              {DateTime.fromJSDate(match.startsAt).toRelative()}
            </Flex>
          </Button>
        ))}
      </Flex>
    </>
  )
}

export default Matches
