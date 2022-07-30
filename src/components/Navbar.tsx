import {
  Avatar,
  Button,
  Container,
  Flex,
  IconButton,
  Menu,
  Link,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  AvatarBadge,
} from '@chakra-ui/react'
import { useSession, signIn, signOut } from 'next-auth/react'
import NextLink from 'next/link'

interface Props {}

const Logo = () => <Flex h="30px" w="30px" bg="black" borderRadius="10px"></Flex>

const Show: React.FC<{ when: boolean; children: JSX.Element; fallback?: JSX.Element }> = ({
  when,
  children,
  fallback,
}) => (when ? children : fallback || null)

const CustomLink: React.FC<{ children: JSX.Element[]; href: string }> = ({ children, href, ...props }) => {
  return (
    <NextLink href={href} passHref>
      <Link {...props}>{children}</Link>
    </NextLink>
  )
}

const Navbar = (_: Props) => {
  const { data, status } = useSession()
  const isAuthenticated = !!data && status === 'authenticated'
  const onClickLogin = () => signIn()
  const onClickLogout = () => signOut()

  return (
    <Flex boxShadow="md" h="64px">
      <Container maxW="container.xl" display="flex" alignItems="center">
        <Button as={CustomLink} href="/" variant="ghost" display="flex" gap={2}>
          <Logo />
          <Text>Quiniela</Text>
        </Button>
        <Spacer />
        <Show
          when={isAuthenticated}
          fallback={
            <Button onClick={onClickLogin} variant="ghost">
              Login
            </Button>
          }
        >
          <Menu>
            <MenuButton as={Button} variant="ghost">
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
              <MenuItem as={CustomLink} href="/admin">
                Admin
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
