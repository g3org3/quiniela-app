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
} from '@chakra-ui/react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

import CustomLink from 'components/CustomLink'
import Logo from 'components/Logo'
import Show from 'components/Show'

interface Props {}

const Navbar = (_: Props) => {
  const router = useRouter()
  const isInsideAdmin = router.pathname.indexOf('/admin') !== -1
  const { data, status } = useSession()
  const isAuthenticated = !!data && status === 'authenticated'
  const onClickLogin = () => signIn('google')
  const onClickLogout = () => signOut({ callbackUrl: '/' })

  return (
    <Flex boxShadow="sm" h="64px">
      <Container maxW="container.xl" display="flex" alignItems="center" gap={2}>
        <Button borderRadius={0} as={CustomLink} href="/" variant="ghost" display="flex" gap={2}>
          <Logo />
          <Text>Quiniela</Text>
          <Badge colorScheme="yellow">beta</Badge>
        </Button>
        {/* @ts-ignore */}
        <Show when={data?.user.role === 'ADMIN'}>
          <Button
            isActive={isInsideAdmin}
            borderRadius={0}
            as={CustomLink}
            href="/admin/tournaments"
            variant="ghost"
            display="flex"
            gap={2}
          >
            <Text>Torneos</Text>
          </Button>
        </Show>
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
            <MenuButton borderRadius={0} as={Button} variant="ghost" rightIcon={<ChevronDownIcon />}>
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
