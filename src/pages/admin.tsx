import { useSession } from 'next-auth/react'

import Layout from 'components/Layout'

interface Props {
  //
}

const Admin = (props: Props) => {
  useSession({ required: true })

  return <Layout>Component(Admin)</Layout>
}

export default Admin
