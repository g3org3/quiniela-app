import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import Matches from 'components/Matches'

interface Props {
  //
}

const TournamentId = (_: Props) => {
  useSession({ required: true })
  const router = useRouter()
  const tournamentId = router.query.tournamentId as string

  return <Matches tournamentId={tournamentId} />
}

export default TournamentId
