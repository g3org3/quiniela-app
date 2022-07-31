import { Button, Flex, Heading, Input, useToast } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { ChangeEventHandler, useState } from 'react'

import CustomLink from 'components/CustomLink'
import Unauthorized from 'components/Unauthorized'
import { trpc } from 'utils/trpc'

interface Props {
  //
}

const Admin = (_: Props) => {
  const { data, status } = useSession({ required: true })
  const [name, setName] = useState<string>('')
  const toast = useToast()
  const createTournament = trpc.useMutation('tournament.create', {
    onSuccess: () => {
      toast({ title: `"${name}" created`, status: 'success' })
      setName('')
    },
    onError: (err) => {
      toast({ title: 'Something went wrong', status: 'error', description: err.message })
    },
  })
  // @ts-ignore
  if (data?.user.role !== 'ADMIN') return <Unauthorized isLoading={status === 'loading'} />

  const onChangeTournamentName: ChangeEventHandler<HTMLInputElement> = ({ target }) => setName(target.value)

  const isFormDisabled = !name.trim() || createTournament.isLoading

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (isFormDisabled) return
    createTournament.mutate(name)
  }

  return (
    <>
      <Flex flexDir="column" gap={4}>
        <Heading as="h1" fontWeight="light">
          Admin
        </Heading>
        <hr />
        <form onSubmit={onSubmit}>
          <Flex flexDir="column" gap={2} boxShadow="md" maxW={{ base: '100%', md: '300px' }} p={10}>
            <Heading as="h2" fontWeight="normal" size="md">
              Create Tournament
            </Heading>
            <Input
              disabled={createTournament.isLoading}
              name="name"
              placeholder="tournament name"
              value={name}
              onChange={onChangeTournamentName}
            />
            <Button
              isLoading={createTournament.isLoading}
              type="submit"
              colorScheme="purple"
              disabled={isFormDisabled}
            >
              create
            </Button>
            <hr style={{ margin: '20px 0' }} />
            <Button as={CustomLink} href="/admin/tournaments">
              View Tournaments
            </Button>
          </Flex>
        </form>
      </Flex>
    </>
  )
}

export default Admin
