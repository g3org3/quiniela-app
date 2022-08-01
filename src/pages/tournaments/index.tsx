import { Button, Flex, Heading, Image, Skeleton, Text } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'

import CustomLink from 'components/CustomLink'
import Show from 'components/Show'
import { trpc } from 'utils/trpc'

const Tournaments: NextPage = () => {
  useSession({ required: true })
  const { prefetchQuery } = trpc.useContext()
  const tournaments = trpc.useQuery(['tournament.getAllActive'], {
    onSuccess(tournaments) {
      for (const t of tournaments) {
        prefetchQuery(['tournament.getOne', t.id])
        if (t.isRace) prefetchQuery(['race.getAll', t.id])
      }
    },
  })

  return (
    <Flex flexDir="column" gap={5}>
      <Heading fontWeight="light">Select a tournament to start betting</Heading>
      <Flex flexWrap="wrap" gap={5}>
        {tournaments.isLoading && (
          <Button
            borderRadius="10px"
            boxShadow="md"
            display="flex"
            flexDir="column"
            h="unset"
            p="0"
            variant="ghost"
            w={{ base: '100%', md: '300px' }}
          >
            <Show fallback={<Skeleton borderTopRadius="10px" h="200px" w="100%" />}>
              <Image borderTopRadius="10px" alt="tournament image" objectFit="cover" h="100px" w="100%" />
            </Show>

            <Text p={3} fontWeight="normal">
              <Skeleton>text long long long</Skeleton>
            </Text>
          </Button>
        )}
        {tournaments.data?.map((tournament) => (
          <Button
            as={CustomLink}
            borderRadius="10px"
            boxShadow="md"
            display="flex"
            flexDir="column"
            h="unset"
            href={`/tournaments/${tournament.id}${tournament.isRace ? '/race' : ''}`}
            key={tournament.id}
            p="0"
            variant="ghost"
            w={{ base: '100%', md: '300px' }}
          >
            <Show
              when={!!tournament.image}
              fallback={<Flex borderTopRadius="10px" height="100px" bg="tomato" w="100%" />}
            >
              <Image
                borderTopRadius="10px"
                alt="tournament image"
                objectFit="cover"
                h={{ base: '200px', md: '200px' }}
                w="100%"
                src={tournament.image || undefined}
              />
            </Show>

            <Text p={3} fontWeight="normal" textTransform="capitalize">
              {tournament.name}
            </Text>
          </Button>
        ))}
      </Flex>
    </Flex>
  )
}

export default Tournaments
