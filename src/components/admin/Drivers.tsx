import { Avatar, Flex, Heading, Image, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'

import { trpc } from 'utils/trpc'

interface Props {
  //
}

const Drivers = (props: Props) => {
  const drivers = trpc.useQuery(['racedriver.getAll'])

  return (
    <Flex flexDir="column" w="50%">
      <Heading fontWeight="normal">Drivers</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Team</Th>
          </Tr>
        </Thead>
        <Tbody>
          {drivers.data?.map((driver) => (
            <Tr key={driver.id}>
              <Td>
                <Flex alignItems="center" gap={2}>
                  <Avatar size="md" src={driver.image || undefined} />
                  {driver.name}
                </Flex>
              </Td>
              <Td>
                <Flex alignItems="center" gap={2}>
                  <Image alt="team logo" h="50px" src={driver.raceteam.image || undefined} />
                  {driver.raceteam.name}
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  )
}

export default Drivers
