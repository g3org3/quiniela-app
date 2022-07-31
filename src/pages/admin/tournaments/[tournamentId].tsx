import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Skeleton,
  Spinner,
  useToast,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import CustomLink from 'components/CustomLink'
import Matches from 'components/Matches'
import Unauthorized from 'components/Unauthorized'
import { trpc } from 'utils/trpc'

interface Props {
  //
}

const Tournaments = (_: Props) => {
  const { data, status } = useSession({ required: true })
  const { invalidateQueries } = trpc.useContext()
  const [homeTeam, setHomeTeam] = useState('')
  const [awayTeam, setAwayTeam] = useState('')
  const [location, setLocation] = useState('')
  const [phase, setPhase] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const router = useRouter()
  const toast = useToast()
  const { tournamentId } = router.query
  const { data: tournament, isLoading } = trpc.useQuery(['tournament.getOne', tournamentId as string])
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

  const setterByField = {
    homeTeam: setHomeTeam,
    awayTeam: setAwayTeam,
    location: setLocation,
    phase: setPhase,
    startsAt: setStartsAt,
  }

  const onChangeTitle: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    updateTournamentTitle.mutate({ id: tournamentId as string, name: e.target.value })
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
      tournamentId: tournamentId as string,
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
        <form onSubmit={onSubmit}>
          <Flex flexDir="column" gap={4} boxShadow="md" maxW={{ base: '100%', md: '68%' }} p={10}>
            <Heading as="h2" fontWeight="normal" size="md">
              Create Match
            </Heading>
            <Flex gap={2} alignItems="center">
              <InputGroup>
                <InputLeftAddon>homeTeam</InputLeftAddon>
                <Input
                  value={homeTeam}
                  disabled={createMatch.isLoading}
                  onChange={onValueChange('homeTeam')}
                  name="homeTeam"
                  placeholder="homeTeam"
                />
              </InputGroup>
              vs
              <InputGroup>
                <InputLeftAddon>awayTeam</InputLeftAddon>
                <Input
                  value={awayTeam}
                  disabled={createMatch.isLoading}
                  onChange={onValueChange('awayTeam')}
                  name="awayTeam"
                  placeholder="awayTeam"
                />
              </InputGroup>
            </Flex>
            <InputGroup>
              <InputLeftAddon>location</InputLeftAddon>
              <Input
                value={location}
                disabled={createMatch.isLoading}
                onChange={onValueChange('location')}
                name="location"
                placeholder="location"
              />
            </InputGroup>
            <Flex gap={4}>
              <InputGroup>
                <InputLeftAddon>phase</InputLeftAddon>
                <Input
                  value={phase}
                  disabled={createMatch.isLoading}
                  onChange={onValueChange('phase')}
                  name="phase"
                  placeholder="phase"
                />
              </InputGroup>
              <InputGroup>
                <InputLeftAddon>startsAt</InputLeftAddon>
                <Input
                  value={startsAt}
                  disabled={createMatch.isLoading}
                  onChange={onValueChange('startsAt')}
                  name="startsAt"
                  placeholder="startsAt"
                  type="datetime-local"
                />
              </InputGroup>
            </Flex>
            <Button
              isLoading={createMatch.isLoading}
              disabled={isFormDisabled}
              type="submit"
              colorScheme="purple"
            >
              create
            </Button>
          </Flex>
        </form>
        <Matches />
      </Flex>
    </>
  )
}

export default Tournaments
