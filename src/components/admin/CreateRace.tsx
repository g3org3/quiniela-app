import { Button, Flex, Heading, Input, useToast } from '@chakra-ui/react'
import { useState } from 'react'

import { trpc } from 'utils/trpc'

interface Props {
  tournamentId: string
}

const CreateRace = ({ tournamentId }: Props) => {
  const [name, setName] = useState<string>('')
  const [circuit, setCircuit] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [startsAt, setStartsAt] = useState<string>('')
  const toast = useToast()
  const { invalidateQueries } = trpc.useContext()

  const clearForm = () => {
    setName('')
    setCircuit('')
    setImage('')
    setStartsAt('')
  }

  const createRace = trpc.useMutation('race.create', {
    onSuccess: () => {
      invalidateQueries(['race.getAll'])
      toast({ variant: 'left-accent', title: `"${name}" created`, status: 'success' })
      clearForm()
    },
    onError: (err) => {
      toast({
        variant: 'left-accent',
        title: 'Something went wrong',
        status: 'error',
        description: err.message,
      })
    },
  })

  const isFormDisabled = !name.trim() || createRace.isLoading

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (isFormDisabled) return
    const race = {
      name,
      circuit,
      image,
      startsAt: new Date(startsAt),
      tournamentId,
    }
    createRace.mutate(race)
  }

  const onChangeName: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => setName(target.value)
  const onChangeCircuit: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => setCircuit(target.value)
  const onChangeImage: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => setImage(target.value)
  const onChangeStartsAt: React.ChangeEventHandler<HTMLInputElement> = ({ target }) =>
    setStartsAt(target.value)

  return (
    <form onSubmit={onSubmit}>
      <Flex
        flexDir="column"
        gap={2}
        boxShadow="md"
        w={{ base: '100%', md: '290px' }}
        borderRadius="10px"
        p={10}
      >
        <Heading as="h2" fontWeight="normal" size="md">
          Create Race
        </Heading>
        <Input
          disabled={createRace.isLoading}
          name="name"
          placeholder="name"
          value={name}
          onChange={onChangeName}
        />
        <Input name="circuit" placeholder="circuit" value={circuit} onChange={onChangeCircuit} />
        <Input name="image" placeholder="image" value={image} onChange={onChangeImage} />
        <Input type="datetime-local" name="startsAt" value={startsAt} onChange={onChangeStartsAt} />
        <Button isLoading={createRace.isLoading} type="submit" colorScheme="purple" disabled={isFormDisabled}>
          create
        </Button>
      </Flex>
    </form>
  )
}

export default CreateRace
