import { Button, Flex, Heading, Image, Spinner, Text } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'

import Login from 'components/Login'
import Show from 'components/Show'
import { trpc } from 'utils/trpc'

const Home: NextPage = () => {
  const { data, status } = useSession()
  const tournaments = trpc.useQuery(['tournament.getAllActive'])

  if (status === 'loading')
    return (
      <Flex h="30%" alignItems="center" justifyContent="center">
        <Spinner />
      </Flex>
    )

  if (!data) return <Login />

  return (
    <Flex flexDir="column" gap={5}>
      <Heading fontWeight="light">Select a tournament to start betting</Heading>
      <Flex flexWrap="wrap" gap={5}>
        {tournaments.data?.map((tournament) => (
          <Button
            key={tournament.id}
            borderRadius="10px"
            boxShadow="md"
            display="flex"
            flexDir="column"
            h="unset"
            p="0"
            variant="ghost"
            w="200px"
          >
            <Show
              when={!!tournament.image}
              fallback={<Flex borderTopRadius="10px" height="100px" bg="tomato" w="100%" />}
            >
              <Image
                borderTopRadius="10px"
                alt="tournament image"
                objectFit="cover"
                h="100px"
                w="100%"
                src={tournament.image || undefined}
              />
            </Show>

            <Text p={3} fontWeight="normal">
              {tournament.name}
            </Text>
          </Button>
        ))}
      </Flex>
    </Flex>
  )
}

export default Home
