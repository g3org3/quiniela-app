import { Flex, Spinner } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import Login from 'components/Login'

const Home: NextPage = () => {
  const { data, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/tournaments')
    }
  }, [router, status])

  if (!data) return <Login />

  return null
}

export default Home
