import { CircularProgress, Flex, Text } from '@chakra-ui/react'

import Layout from 'components/Layout'
import Show from 'components/Show'

interface Props {
  isLoading?: boolean
}

const Unauthorized = ({ isLoading }: Props) => (
  <Layout>
    <Flex h="68%" alignItems="center" justifyContent="center">
      <Flex>
        <Show when={!isLoading} fallback={<CircularProgress isIndeterminate />}>
          <>
            <Text borderRight="1px solid" mr="20px" pr="20px" fontSize="24px" fontWeight="500">
              403
            </Text>
            <Text fontSize="16px" display="flex" alignItems="center">
              Forbidden
            </Text>
          </>
        </Show>
      </Flex>
    </Flex>
  </Layout>
)

export default Unauthorized
