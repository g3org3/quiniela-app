import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'

import Layout from 'components/Layout'
import { trpc } from 'utils/trpc'

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['example.hello', { text: 'from tRPC' }])

  const { data: session } = useSession()

  return (
    <Layout>
      <pre>{data ? data.greeting : 'loading...'}</pre>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </Layout>
  )
}

export default Home
