import { Button, Flex, Heading, Spacer } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import CustomLink from 'components/CustomLink'
import Matches from 'components/Matches'
import { trpc } from 'utils/trpc'

import groups from './groups'

interface Props {
  //
}

const TournamentId = (_: Props) => {
  useSession({ required: true })
  const router = useRouter()
  const tournamentId = router.query.tournamentId as string
  const groups = trpc.useQuery(['group.getAllJoined'])
  const tournament = trpc.useQuery(['tournament.getOne', tournamentId], {
    onSuccess(tournament) {
      if (tournament.isRace) router.push(`/tournaments/${tournament.id}/races`)
    },
  })

  return (
    <Flex flexDir="column" gap={5}>
      <Heading fontWeight="light" textTransform="capitalize" display="flex">
        {tournament.data?.name}
        <Spacer />
        {groups.data && groups.data.length > 0 && (
          <Button
            as={CustomLink}
            href={`/tournaments/${tournamentId}/groups/${groups.data[0]?.groupId}`}
            size="sm"
            variant="outline"
            colorScheme="purple"
          >
            view {groups.data[0]?.group.name}&lsquo;s leaderboard
          </Button>
        )}
      </Heading>
      <Matches tournamentId={tournamentId} />
    </Flex>
  )
}

export default TournamentId
