import { Text, Flex, Heading, Image, Input, Button, useToast, Skeleton } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

import CustomLink from 'components/CustomLink'
import { trpc } from 'utils/trpc'

const Match = () => {
  const router = useRouter()
  const [home, setHome] = useState<string | number>('')
  const [away, setAway] = useState<string | number>('')
  const toaster = useToast()
  const matchId = router.query.matchId as string
  const match = trpc.useQuery(['match.getOneById', matchId])
  const bet = trpc.useQuery(['bet.getMineByMatchId', matchId], {
    onSuccess(b) {
      if (b?.homeTeamScore) setHome(b.homeTeamScore)
      if (b?.awayTeamScore) setAway(b.awayTeamScore)
    },
  })
  const updateBet = trpc.useMutation('bet.upsert', {
    onSuccess() {
      toaster({ title: 'success', status: 'success' })
    },
    onError() {
      toaster({ title: 'error', status: 'error' })
    },
  })

  const onClickSave = () => {
    updateBet.mutate({ matchId, home: Number(home), away: Number(away) })
  }
  const onChangeHome: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setHome(e.target.value)
  }
  const onChangeAway: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setAway(e.target.value)
  }

  return (
    <Flex flexDir="column" gap={5}>
      <Heading fontWeight="light">
        <CustomLink href={`/tournaments/${match.data?.Tournament.id}`}>
          {match.data?.Tournament.name}
        </CustomLink>
      </Heading>
      <Button
        isLoading={updateBet.isLoading}
        onClick={onClickSave}
        colorScheme="purple"
        alignSelf="flex-end"
        w="30%"
      >
        Save
      </Button>
      <Flex justifyContent="center" gap={5}>
        <Flex flexDir="column" alignItems="center" justifyContent="center">
          <Image alt="logo" h="100px" w="100px" objectFit="cover" src={match.data?.homeTeamImage || ''} />
          <Text fontSize="xx-large">{match.data?.homeTeam}</Text>
          <Skeleton isLoaded={!bet.isLoading}>
            <Input
              value={home}
              onChange={onChangeHome}
              fontSize="4xl"
              isDisabled={updateBet.isLoading}
              textAlign="center"
              placeholder="-"
              type="number"
            />
          </Skeleton>
        </Flex>
        <Flex flexDir="column" alignItems="center" justifyContent="center">
          <Text fontSize="6xl">vs</Text>
        </Flex>
        <Flex flexDir="column" alignItems="center" justifyContent="center">
          <Image alt="logo" h="100px" w="100px" objectFit="cover" src={match.data?.awayTeamImage || ''} />
          <Text fontSize="xx-large">{match.data?.awayTeam}</Text>
          <Skeleton isLoaded={!bet.isLoading}>
            <Input
              value={away}
              onChange={onChangeAway}
              fontSize="4xl"
              isDisabled={updateBet.isLoading}
              textAlign="center"
              placeholder="-"
              type="number"
            />
          </Skeleton>
        </Flex>
      </Flex>
      <Flex>
        <Heading fontWeight="light">Bets</Heading>
      </Flex>
    </Flex>
  )
}

export default Match
