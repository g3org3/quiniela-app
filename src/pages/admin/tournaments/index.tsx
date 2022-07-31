import { Avatar, Badge, Button, Flex, Heading, Link, Skeleton, Text, Toast, useToast } from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'
import NextLink from 'next/link'

import CreateTournament from 'components/admin/CreateTournament'
import CustomLink from 'components/CustomLink'
import Unauthorized from 'components/Unauthorized'
import { trpc } from 'utils/trpc'

interface Props {
  //
}

const Tournaments = (_: Props) => {
  const { invalidateQueries } = trpc.useContext()
  const toast = useToast()
  const { data, status } = useSession({ required: true })
  const tournaments = trpc.useQuery(['tournament.getAll'])
  const toggleStatus = trpc.useMutation('tournament.toggle-status', {
    onSuccess: () => {
      invalidateQueries(['tournament.getAll'])
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
  const del = trpc.useMutation('tournament.delete', {
    onSuccess: () => {
      invalidateQueries(['tournament.getAll'])
      toast({ variant: 'left-accent', title: 'Deleted', status: 'success' })
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

  // @ts-ignore
  if (data?.user.role !== 'ADMIN') return <Unauthorized isLoading={status === 'loading'} />

  const onClickDelete = (id: string) => () => del.mutate(id)
  const onClickToggleStatus = (id: string) => () => toggleStatus.mutate(id)

  return (
    <>
      <Flex flexDir="column" gap={4}>
        <Heading as="h1" fontWeight="light">
          <NextLink href="/admin" passHref>
            <Link>Ad</Link>
          </NextLink>{' '}
          / Tournaments
        </Heading>
        <hr />
        <Skeleton
          isLoaded={!tournaments.isLoading}
          h={tournaments.isLoading ? '176px' : undefined}
          w={tournaments.isLoading ? '300px' : undefined}
          boxShadow={tournaments.isLoading ? 'md' : undefined}
        >
          <Flex gap={5} flexWrap="wrap">
            <CreateTournament />
            {tournaments.data?.map((tournament) => (
              <Flex
                key={tournament.id}
                flexDir="column"
                gap={2}
                boxShadow="md"
                borderRadius="10px"
                w={{ base: '100%', md: '290px' }}
                p={6}
              >
                <Heading as="h2" fontWeight="normal" size="md" display="flex" gap={2} alignItems="center">
                  {tournament.name}
                  <Badge borderRadius="5px" colorScheme={tournament.status === 'BUILDING' ? 'blue' : 'green'}>
                    {tournament.status}
                  </Badge>
                  {tournament.isRace && (
                    <Badge borderRadius="5px" colorScheme="yellow">
                      race
                    </Badge>
                  )}
                </Heading>
                <Flex alignItems="center" gap={2}>
                  <Avatar
                    name={tournament.User.name || undefined}
                    src={tournament.User.image || undefined}
                    size="sm"
                  />
                  {tournament.User.name}
                </Flex>
                <Text title={DateTime.fromJSDate(tournament.createdAt).toFormat('yyyy-MM-dd HH:mm')}>
                  {DateTime.fromJSDate(tournament.createdAt).toRelative()}
                </Text>
                <Button
                  variant="outline"
                  colorScheme={tournament.status === 'BUILDING' ? 'green' : 'orange'}
                  isLoading={toggleStatus.isLoading}
                  disabled={toggleStatus.isLoading}
                  onClick={onClickToggleStatus(tournament.id)}
                >
                  {tournament.status === 'BUILDING' ? 'Activate' : 'Deactivate'}
                </Button>
                <Button
                  as={CustomLink}
                  variant="outline"
                  colorScheme="purple"
                  href={`/admin/tournaments/${tournament.id}${tournament.isRace ? '/race' : ''}`}
                >
                  View
                </Button>
                <Button
                  mt={4}
                  disabled={del.isLoading}
                  isLoading={del.isLoading}
                  onClick={onClickDelete(tournament.id)}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                >
                  DELETE
                </Button>
              </Flex>
            ))}
          </Flex>
        </Skeleton>
      </Flex>
    </>
  )
}

export default Tournaments
