import { useSession } from 'next-auth/react'

import Layout from 'components/Layout'
import Unauthorized from 'components/Unauthorized'

interface Props {
  //
}

const Admin = (props: Props) => {
  const { data, status } = useSession({ required: true })
  // @ts-ignore
  if (data?.user.role !== 'ADMIN') return <Unauthorized isLoading={status === 'loading'} />

  return <Layout>Component(Admin)</Layout>
}

export default Admin
