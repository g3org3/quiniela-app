import { Flex, Heading } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import CustomLink from 'components/CustomLink'
import Matches from 'components/Matches'
import { trpc } from 'utils/trpc'

interface Props {
  //
}

const TournamentId = (_: Props) => {
  useSession({ required: true })
  const router = useRouter()
  const tournamentId = router.query.tournamentId as string
  const tournamnet = trpc.useQuery(['tournament.getOne', tournamentId])

  return (
    <Flex flexDir="column" gap={5}>
      <Heading fontWeight="light" textTransform="capitalize">
        {tournamnet.data?.name}
      </Heading>
      <Matches tournamentId={tournamentId} />
    </Flex>
  )
}

export default TournamentId
