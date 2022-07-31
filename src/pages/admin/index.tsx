import { Button, Flex, Heading } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'

import CustomLink from 'components/CustomLink'
import Unauthorized from 'components/Unauthorized'

interface Props {
  //
}

const Admin = (_: Props) => {
  const { data, status } = useSession({ required: true })

  // @ts-ignore
  if (data?.user.role !== 'ADMIN') return <Unauthorized isLoading={status === 'loading'} />

  return (
    <>
      <Flex flexDir="column" gap={4}>
        <Heading as="h1" fontWeight="light">
          Admin
        </Heading>
        <hr />
        <Flex flexDir="column" gap={2} boxShadow="md" maxW={{ base: '100%', md: '300px' }} p={10}>
          <Button as={CustomLink} href="/admin/tournaments">
            View Tournaments
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default Admin
