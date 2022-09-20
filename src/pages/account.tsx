import { CopyIcon } from '@chakra-ui/icons'
import {
  Avatar,
  AvatarBadge,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
} from '@chakra-ui/react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSession } from 'next-auth/react'

import Solana from './solana'

interface Props {
  //
}

const Account = (_: Props) => {
  const { data } = useSession({ required: true })
  const { publicKey } = useWallet()
  if (!data?.user) return null

  return (
    <Flex flexDir="column" gap={10}>
      <Flex alignItems="center" gap={4}>
        <Avatar src={data.user.image || undefined} size="lg">
          <AvatarBadge boxSize="1.25em" bg="green.300" />
        </Avatar>
        <Heading as="h2" fontWeight="light">
          <Flex gap={4} alignItems="center">
            {data.user.name}
          </Flex>
          <Flex
            as="small"
            fontFamily="monospace"
            fontSize="16px"
            gap={2}
            alignItems="center"
            display={{ base: 'none', md: 'flex' }}
          >
            <IconButton aria-label="copy" size="xs">
              <Icon as={CopyIcon} />
            </IconButton>
            <Text>{data.user.id}</Text>
          </Flex>
        </Heading>
      </Flex>
      <Flex flexDir="column" gap={2}>
        <InputGroup>
          <InputLeftAddon>Email</InputLeftAddon>
          <Input disabled name="email" value={data.user.email || undefined} />
        </InputGroup>
      </Flex>
      <hr />
      <Solana />
      <hr />
    </Flex>
  )
}

export default Account
