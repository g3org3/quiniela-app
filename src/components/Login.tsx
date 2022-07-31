import { Flex, Heading } from '@chakra-ui/react'

interface Props {
  //
}

const Login = (_: Props) => {
  return (
    <Flex h="30%" alignItems="center" justifyContent="center">
      <Heading fontWeight="light">please login</Heading>
    </Flex>
  )
}

export default Login
