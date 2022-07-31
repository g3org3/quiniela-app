import { Flex, Heading, Link, Skeleton, Text } from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'

import Layout from 'components/Layout'
import Unauthorized from 'components/Unauthorized'
import { trpc } from 'utils/trpc'

interface Props {
  //
}

const Tournaments = (props: Props) => {
  const { data, status } = useSession({ required: true })
  const tournaments = trpc.useQuery(['tournament.getAll'])

  // @ts-ignore
  if (data?.user.role !== 'ADMIN') return <Unauthorized isLoading={status === 'loading'} />

  return (
    <Layout>
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
          <Flex gap={5}>
            {tournaments.data?.map((tournament) => (
              <Flex key={tournament.id} flexDir="column" gap={2} boxShadow="md" w="300px" p={6}>
                <Heading as="h2" fontWeight="normal" size="md">
                  {tournament.name}
                </Heading>
                - {tournament.User.name}
                <Text title={DateTime.fromJSDate(tournament.createdAt).toFormat('yyyy-MM-dd HH:mm')}>
                  {DateTime.fromJSDate(tournament.createdAt).toRelative()}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Skeleton>
      </Flex>
    </Layout>
  )
}

export default Tournaments
