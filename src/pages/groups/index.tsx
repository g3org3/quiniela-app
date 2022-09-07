import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Input,
  Text,
  Spacer,
  useDisclosure,
  useToast,
  useClipboard,
  Divider,
} from '@chakra-ui/react'
import React, { useState } from 'react'

import CustomLink from 'components/CustomLink'
import { env } from 'env/client.mjs'
import { trpc } from 'utils/trpc'

function DrawerExample() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const toaster = useToast()
  const [name, setName] = useState('')
  const { invalidateQueries } = trpc.useContext()
  const createGroup = trpc.useMutation('group.create', {
    onSuccess() {
      onClose()
      invalidateQueries(['group.getAllJoined'])
      invalidateQueries(['group.getAllMine'])
      toaster({ title: 'success', status: 'success' })
    },
    onError() {
      toaster({ title: 'Error', status: 'error' })
    },
  })

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault()
    createGroup.mutate(name)
  }

  return (
    <>
      <Button ref={btnRef as never} colorScheme="teal" onClick={onOpen}>
        new group
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef as never}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create a group</DrawerHeader>
          <Divider />
          <DrawerBody>
            <form onSubmit={onSubmit}>
              <Text>Name</Text>
              <Input onChange={(e) => setName(e.target.value)} placeholder="Type here..." />
              <Button type="submit" display="none">
                submit
              </Button>
            </form>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

const ButtonCard = ({ id, title }: { id: string; title: string }) => {
  const toaster = useToast()
  const url = `${env.NEXT_PUBLIC_URL}/?joinGroup=${id}`
  const { onCopy } = useClipboard(url)

  const onClick = () => {
    onCopy()
    toaster({ title: 'copied to your clipboard', status: 'success' })
  }

  return (
    <Flex borderBottom="1px solid" borderColor="gray.200" alignItems="center" gap={5} p={2}>
      <CustomLink href={`/groups/${id}`} flex={1} p={2}>
        <Text>{title}</Text>
      </CustomLink>
      <Button as={CustomLink} href={`/groups/${id}`} size="sm" onClick={onClick}>
        view leaderboard
      </Button>
      <Button variant="outline" size="sm" colorScheme="twitter" onClick={onClick}>
        copy link to share
      </Button>
    </Flex>
  )
}

const Groups = () => {
  const joinedGroups = trpc.useQuery(['group.getAllJoined'])
  const myGroups = trpc.useQuery(['group.getAllMine'])

  return (
    <Flex flexDir="column" gap={5}>
      <Heading display="flex" fontWeight="light">
        <Text>Groups</Text>
        <Spacer />
        <DrawerExample />
      </Heading>
      <Flex flexDir="column" pt={5} gap={2}>
        {joinedGroups.data?.map((group) => (
          <ButtonCard key={group.groupId} id={group.groupId} title={group.group.name} />
        ))}
      </Flex>
    </Flex>
  )
}

export default Groups
