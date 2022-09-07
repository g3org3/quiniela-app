import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Heading,
  Image,
  Skeleton,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import CustomLink from 'components/CustomLink'
import Show from 'components/Show'
import { trpc } from 'utils/trpc'

const Tournaments: NextPage = () => {
  useSession({ required: true })
  const router = useRouter()
  const toaster = useToast()
  const gray = useColorModeValue('#eee', 'gray.700')
  const { prefetchQuery } = trpc.useContext()
  const joinGroup = trpc.useMutation('group.join', {
    onSuccess(group) {
      toaster({ title: 'Joined group ' + group.name, status: 'success' })
      router.push('/tournaments')
    },
  })
  const tournaments = trpc.useQuery(['tournament.getAllActive'], {
    onSuccess(tournaments) {
      for (const t of tournaments) {
        prefetchQuery(['tournament.getOne', t.id])
        if (t.isRace) prefetchQuery(['race.getAll', t.id])
      }
    },
  })

  useEffect(() => {
    if (router.query.joinGroup && typeof router.query.joinGroup === 'string') {
      joinGroup.mutate(router.query.joinGroup)
    }
  }, [router.query.joinGroup])

  return (
    <Flex flexDir="column" gap={5}>
      <Heading fontWeight="light">Tournaments</Heading>
      <Alert>
        <AlertIcon />
        Select a tournament to start betting!
      </Alert>
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
            w={{ base: '100%', md: '340px' }}
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
            borderRadius="0"
            borderTopRadius="10px"
            boxShadow="md"
            display="flex"
            flexDir="column"
            h="unset"
            href={`/tournaments/${tournament.id}${tournament.isRace ? '/race' : ''}`}
            key={tournament.id}
            p="0"
            variant="ghost"
            border="1px solid"
            borderColor={gray}
            borderBottom="5px solid"
            borderBottomColor="red.700"
            w={{ base: '100%', md: '340px' }}
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
