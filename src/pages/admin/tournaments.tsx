import { Button, Flex, Heading, Link, Skeleton, Text, Toast, useToast } from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'

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
  const del = trpc.useMutation('tournament.delete', {
    onSuccess: () => {
      invalidateQueries(['tournament.getAll'])
      toast({ title: 'Deleted', status: 'success' })
    },
    onError: (err) => {
      Toast({ title: 'Something went wrong', description: err.message, status: 'error' })
    },
  })

  // @ts-ignore
  if (data?.user.role !== 'ADMIN') return <Unauthorized isLoading={status === 'loading'} />

  const onClickDelete = (id: string) => () => del.mutate(id)

  return (
    <>
      <Flex flexDir="column" gap={4}>
        <Heading as="h1" fontWeight="light">
          <Link href="/admin">Admin</Link> / Tournaments
        </Heading>
        <hr />
        <Skeleton
          isLoaded={!tournaments.isLoading}
          h={tournaments.isLoading ? '128px' : undefined}
          w={tournaments.isLoading ? '300px' : undefined}
          boxShadow={tournaments.isLoading ? 'md' : undefined}
        >
          <Flex gap={5} flexWrap="wrap">
            {tournaments.data?.map((tournament) => (
              <Flex key={tournament.id} flexDir="column" gap={2} boxShadow="md" w="300px" p={6}>
                <Heading as="h2" fontWeight="normal" size="md">
                  {tournament.name}
                </Heading>
                - {tournament.User.name}
                <Text title={DateTime.fromJSDate(tournament.createdAt).toFormat('yyyy-MM-dd HH:mm')}>
                  {DateTime.fromJSDate(tournament.createdAt).toRelative()}
                </Text>
                <Button
                  disabled={del.isLoading}
                  isLoading={del.isLoading}
                  onClick={onClickDelete(tournament.id)}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                >
                  delete
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
