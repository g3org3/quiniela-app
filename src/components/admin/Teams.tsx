import { Flex, Heading, Image, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'

import { trpc } from 'utils/trpc'

interface Props {
  //
}

const Teams = (props: Props) => {
  const teams = trpc.useQuery(['raceteam.getAll'])

  return (
    <Flex flexDir="column" w="50%">
      <Heading fontWeight="normal">Teams</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {teams.data?.map((team) => (
            <Tr key={team.id}>
              <Td>
                <Flex alignItems="center" gap={2}>
                  <Image alt="team logo" h="50px" src={team.image || undefined} />
                  {team.name}
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  )
}

export default Teams
