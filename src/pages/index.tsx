import { Flex, Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'

const Home: NextPage = () => {
  const { data } = useSession()

  return (
    <Flex h="30%" alignItems="center" justifyContent="center">
      <Heading fontWeight="light">
        Welcome {data?.user?.name}
        <br /> more coming sooon
      </Heading>
    </Flex>
  )
}

export default Home
