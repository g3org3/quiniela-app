import { Button, Flex, Heading, Input, useToast } from '@chakra-ui/react'
import { useState } from 'react'

import { trpc } from 'utils/trpc'

interface Props {
  //
}

const CreateTournament = (props: Props) => {
  const [name, setName] = useState<string>('')
  const toast = useToast()
  const { invalidateQueries } = trpc.useContext()
  const createTournament = trpc.useMutation('tournament.create', {
    onSuccess: () => {
      invalidateQueries(['tournament.getAll'])
      toast({ title: `"${name}" created`, status: 'success' })
      setName('')
    },
    onError: (err) => {
      toast({ title: 'Something went wrong', status: 'error', description: err.message })
    },
  })

  const isFormDisabled = !name.trim() || createTournament.isLoading

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (isFormDisabled) return
    createTournament.mutate(name)
  }

  const onChangeTournamentName: React.ChangeEventHandler<HTMLInputElement> = ({ target }) =>
    setName(target.value)

  return (
    <form onSubmit={onSubmit}>
      <Flex
        flexDir="column"
        gap={2}
        boxShadow="md"
        w={{ base: '100%', md: '290px' }}
        borderRadius="10px"
        h="240px"
        p={10}
      >
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
      </Flex>
    </form>
  )
}

export default CreateTournament
