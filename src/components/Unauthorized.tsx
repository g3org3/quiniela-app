import { Flex, Text } from '@chakra-ui/react'

import Show from 'components/Show'

interface Props {
  isLoading?: boolean
}

const Unauthorized = ({ isLoading }: Props) => (
  <>
    <Flex h="68%" alignItems="center" justifyContent="center">
      <Flex>
        <Show when={!isLoading}>
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
  </>
)

export default Unauthorized
