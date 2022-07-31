import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Skeleton,
  Spinner,
  useToast,
  Text,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import CreateRace from 'components/admin/CreateRace'
import Drivers from 'components/admin/Drivers'
import Matches from 'components/admin/Matches'
import Teams from 'components/admin/Teams'
import CustomLink from 'components/CustomLink'
import Unauthorized from 'components/Unauthorized'
import { trpc } from 'utils/trpc'

interface Props {
  //
}

const Race = (_: Props) => {
  const { data, status } = useSession({ required: true })
  const { invalidateQueries } = trpc.useContext()
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [location, setLocation] = useState('')
  const [phase, setPhase] = useState('')
  const [startsAt, setStartsAt] = useState('')
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

  const setterByField = {
    homeTeam: setHomeTeam,
    awayTeam: setAwayTeam,
    location: setLocation,
    phase: setPhase,
    startsAt: setStartsAt,
  }

  const onChangeTitle: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    updateTournamentTitle.mutate({ id: tournamentId, name: e.target.value })
  }
  const onChangeImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value === 'click me') return
    updateTournamentImage.mutate({ id: tournamentId, image: e.target.value })
  }

  const clearForm = () => {
    Object.keys(setterByField).forEach((field) => {
      // @ts-ignore
      setterByField[field]('')
    })
  }

  const createMatch = trpc.useMutation('match.create', {
    onSuccess() {
      invalidateQueries(['match.getAllByTournamentId'])
      toast({ variant: 'left-accent', title: 'Match created!', status: 'success' })
      clearForm()
    },
    onError(err) {
      toast({
        variant: 'left-accent',
        title: 'Something went wrong',
        status: 'error',
        description: err.message,
      })
    },
  })

  // @ts-ignore
  if (data?.user.role !== 'ADMIN') return <Unauthorized isLoading={status === 'loading'} />
  if (!isLoading && !data) return <Unauthorized isLoading={status === 'loading'} />

  const isFormDisabled = !homeTeam.trim() || !awayTeam.trim() || !startsAt || createMatch.isLoading

  type FieldKey = keyof typeof setterByField

  const onValueChange =
    (field: FieldKey): React.ChangeEventHandler<HTMLInputElement> =>
    (e) =>
      // @ts-ignore
      setterByField[field](e.target.value)

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (isFormDisabled) return

    const match = {
      homeTeam,
      awayTeam,
      location: !location.trim() ? undefined : location.trim(),
      phase: !phase.trim() ? undefined : phase.trim(),
      startsAt: new Date(startsAt),
      tournamentId,
    }

    createMatch.mutate(match)
  }

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
      </Flex>
    </>
  )
}

export default Race
