import {
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  Image,
  Link,
  Skeleton,
  Spinner,
  useToast,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import CreateRace from 'components/admin/CreateRace'
import Drivers from 'components/admin/Drivers'
import Races from 'components/admin/Races'
import CustomLink from 'components/CustomLink'
import Unauthorized from 'components/Unauthorized'
import { trpc } from 'utils/trpc'

interface Props {
  //
}

const Race = (_: Props) => {
  const { data, status } = useSession({ required: true })
  const { invalidateQueries } = trpc.useContext()
  const router = useRouter()
  const toast = useToast()
  const tournamentId = router.query.tournamentId as string
  const { data: tournament, isLoading } = trpc.useQuery(['tournament.getOne', tournamentId])
  const updateTournamentTitle = trpc.useMutation('tournament.rename', {
    onSuccess: () => {
      invalidateQueries(['tournament.getOne'])
      toast({ variant: 'left-accent', title: 'Renamed', status: 'success' })
    },
    onError: (err) => {
      toast({
        variant: 'left-accent',
        title: 'Something went wrong',
        description: err.message,
        status: 'error',
      })
    },
  })
  const updateTournamentImage = trpc.useMutation('tournament.update-image', {
    onSuccess: () => {
      invalidateQueries(['tournament.getOne'])
      toast({ variant: 'left-accent', title: 'Updated', status: 'success' })
    },
    onError: (err) => {
      toast({
        variant: 'left-accent',
        title: 'Something went wrong',
        description: err.message,
        status: 'error',
      })
    },
  })

  const onChangeTitle: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    updateTournamentTitle.mutate({ id: tournamentId, name: e.target.value })
  }
  const onChangeImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value === 'click me') return
    updateTournamentImage.mutate({ id: tournamentId, image: e.target.value })
  }

  if (data?.user?.role !== 'ADMIN') return <Unauthorized isLoading={status === 'loading'} />
  if (!isLoading && !data) return <Unauthorized isLoading={status === 'loading'} />

  return (
    <>
      <Flex flexDir="column" gap={4} pt={2}>
        <Heading as="h1" fontWeight="light">
          <NextLink href="/admin" passHref>
            <Link>Ad</Link>
          </NextLink>{' '}
          / <CustomLink href="/admin/tournaments">To</CustomLink> /{' '}
          <Skeleton display="inline-flex" isLoaded={!isLoading} alignItems="center" gap={2}>
            <Editable isDisabled={updateTournamentTitle.isLoading} defaultValue={tournament?.name}>
              <EditablePreview color={updateTournamentTitle.isLoading ? 'purple' : undefined} />
              <EditableInput onBlur={onChangeTitle} />
            </Editable>
            {updateTournamentTitle.isLoading && <Spinner />}
          </Skeleton>
        </Heading>
        <hr />
        <Skeleton isLoaded={!updateTournamentImage.isLoading && !isLoading}>
          <Editable
            isDisabled={updateTournamentImage.isLoading}
            defaultValue={tournament?.image || 'click me'}
          >
            <EditablePreview color={updateTournamentImage.isLoading ? 'purple' : undefined} />
            <EditableInput onBlur={onChangeImage} />
          </Editable>
        </Skeleton>
        <Flex gap={4}>
          <Flex w="32%" flexDir="column" gap={8}>
            <Skeleton isLoaded={!updateTournamentImage.isLoading && !isLoading}>
              <Image
                alt="tournament image"
                fallbackSrc="https://via.placeholder.com/200"
                src={tournament?.image || undefined}
              />
            </Skeleton>
            <CreateRace tournamentId={tournamentId} />
          </Flex>
          <Drivers />
        </Flex>
        <Races tournamentId={tournamentId} />
      </Flex>
    </>
  )
}

export default Race
