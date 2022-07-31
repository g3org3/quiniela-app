import { Button, Flex, Heading, Link, Skeleton, Text, Toast, useToast } from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'
import NextLink from 'next/link'

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
          <NextLink href="/admin" passHref>
            <Link>Admin</Link>
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
            {tournaments.data?.map((tournament) => (
              <Flex
                key={tournament.id}
                flexDir="column"
                gap={2}
                boxShadow="md"
                w={{ base: '100%', md: '300px' }}
                p={6}
              >
                <Heading as="h2" fontWeight="normal" size="md">
                  {tournament.name}
                </Heading>
                - {tournament.User.name}
                <Text title={DateTime.fromJSDate(tournament.createdAt).toFormat('yyyy-MM-dd HH:mm')}>
                  {DateTime.fromJSDate(tournament.createdAt).toRelative()}
                </Text>
                <Button
                  as={CustomLink}
                  variant="outline"
                  colorScheme="purple"
                  href={`/admin/tournaments/${tournament.id}`}
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
