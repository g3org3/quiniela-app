import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import Races from 'components/Races'

interface Props {
  //
}

const Race = (_: Props) => {
  useSession({ required: true })
  const router = useRouter()
  const tournamentId = router.query.tournamentId as string

  return <Races tournamentId={tournamentId} />
}

export default Race
