import { Button, Flex, Heading } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

import GoogleLogo from './GoogleLogo'

interface Props {
  //
}

const Login = (_: Props) => {
  const router = useRouter()
  const qs = !router.query.joinGroup ? '' : '?joinGroup=' + router.query.joinGroup

  return (
    <Flex alignItems="center" justifyContent="center" h="30%" flexDir="column" gap={2}>
      <Heading size="3xl" fontWeight="light">
        Please login
      </Heading>
      <Button
        variant="outline"
        onClick={() => signIn('google', { callbackUrl: '/tournaments' + qs })}
        size="lg"
        flexShrink="0"
      >
        <Flex gap={2} alignItems="center">
          <GoogleLogo />
          Login with Google
        </Flex>
      </Button>
    </Flex>
  )
}

export default Login
