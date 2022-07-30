import { Container } from '@chakra-ui/react'
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
      <Navbar />
      <Container maxW="container.xl" pt={4}>
        {children}
      </Container>
    </>
  )
}

export default Layout
