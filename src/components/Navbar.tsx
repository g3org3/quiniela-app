import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Button,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  AvatarBadge,
  Badge,
  Link,
} from '@chakra-ui/react'
import { useSession, signIn, signOut } from 'next-auth/react'
import NextLink from 'next/link'

import CustomLink from 'components/CustomLink'
import Logo from 'components/Logo'
import Show from 'components/Show'

interface Props {}

const Navbar = (_: Props) => {
  const { data, status } = useSession()
  const isAuthenticated = !!data && status === 'authenticated'
  const onClickLogin = () => signIn('google')
  const onClickLogout = () => signOut({ callbackUrl: '/' })

  return (
    <Flex boxShadow="sm" h="64px">
      <Container maxW="container.xl" display="flex" alignItems="center">
        <Button as={CustomLink} href="/" variant="ghost" display="flex" gap={2}>
          <Logo />
          <Text>Quiniela</Text>
          {/* @ts-ignore */}
          <Show when={data?.user.role === 'ADMIN'} fallback={<Badge colorScheme="yellow">beta</Badge>}>
            <NextLink href="/admin" passHref>
              <Link>
                <Badge colorScheme="purple">admin</Badge>
              </Link>
            </NextLink>
          </Show>
        </Button>
        <Spacer />
        <Show
          when={isAuthenticated}
          fallback={
            <Button isLoading={status === 'loading'} onClick={onClickLogin} variant="ghost">
              Login
            </Button>
          }
        >
          <Menu>
            <MenuButton as={Button} variant="ghost" rightIcon={<ChevronDownIcon />}>
              <Flex alignItems="center" gap={2}>
                <Avatar name={data?.user?.name || undefined} src={data?.user?.image || undefined} size="sm">
                  <AvatarBadge boxSize="1em" bg="green.300" />
                </Avatar>
                {data?.user?.name}
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem as={CustomLink} href="/account">
                Account
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={onClickLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Show>
      </Container>
    </Flex>
  )
}

export default Navbar
