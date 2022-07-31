import { CopyIcon } from '@chakra-ui/icons'
import {
  Avatar,
  AvatarBadge,
  Badge,
  Flex,
  Heading,
  Link,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import NextLink from 'next/link'

import Layout from 'components/Layout'

interface Props {
  //
}

const Account = (_: Props) => {
  const { data } = useSession({ required: true })
  if (!data?.user) return null

  return (
    <Layout>
      <Flex alignItems="center" gap={4}>
        <Avatar src={data.user.image || undefined} size="lg">
          <AvatarBadge boxSize="1.25em" bg="green.300" />
        </Avatar>
        <Heading as="h2" fontWeight="light">
          <Flex gap={4} alignItems="center">
            {data.user.name}
            <NextLink href="/admin" passHref>
              <Link>
                <Badge colorScheme="purple">admin</Badge>
              </Link>
            </NextLink>
          </Flex>
          <Flex as="small" fontFamily="monospace" fontSize="16px" gap={2} alignItems="center">
            <IconButton aria-label="copy" size="xs">
              <Icon as={CopyIcon} />
            </IconButton>
            {data.user.id}
          </Flex>
        </Heading>
      </Flex>
      <Flex mt={4}>
        <InputGroup>
          <InputLeftAddon>Email</InputLeftAddon>
          <Input disabled name="email" value={data.user.email || undefined} />
        </InputGroup>
      </Flex>
    </Layout>
  )
}

export default Account
