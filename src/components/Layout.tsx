import { Container, Flex } from '@chakra-ui/react'
import Head from 'next/head'

import Navbar from 'components/Navbar'

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Head>
        <title>Quiniela</title>
        <meta name="description" content="Quiniela" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex as="main" flexDir="column" h="100vh">
        <Navbar />
        <Container maxW="container.xl" flex="1" overflow="auto" pt={5} pb={10}>
          {children}
        </Container>
      </Flex>
    </>
  )
}

export default Layout
