import { Button, Flex, Heading } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'

interface Props {
  //
}

const Login = (_: Props) => {
  return (
    <Flex h="30%" alignItems="center" justifyContent="center" flexDir="column" gap={2}>
      <Heading fontWeight="light">please login</Heading>
      <Button onClick={() => signIn('google')}>Login with Google</Button>
    </Flex>
  )
}

export default Login
