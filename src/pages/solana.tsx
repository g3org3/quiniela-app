import { Alert, Text, AlertIcon, Badge, Button, Flex, Heading, Image, useToast } from '@chakra-ui/react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useEffect, useState } from 'react'

const SOL = 1000000000
const Solana = () => {
  const { connection } = useConnection()
  const toast = useToast()
  const { setVisible } = useWalletModal()
  const { wallet, disconnect, connected, publicKey } = useWallet()
  const [status, setStatus] = useState('')

  useEffect(() => {
    const main = async () => {
      console.log({ connected, status, publicKey: publicKey?.toString() })
      if (connected && status === 'connecting' && publicKey) {
        try {
          const aidropSignature = await connection.requestAirdrop(publicKey, 1 * SOL)
          await connection.confirmTransaction(aidropSignature)
          toast({ title: '1 SOL Sent!', status: 'success' })
        } catch (err: any) {
          toast({ title: 'Something went wrong', status: 'error', description: err?.message || err })
        }
      }
    }
    main().catch(() => {})
  }, [connected, status, publicKey, connection, toast])

  const onClick = async () => {
    try {
      if (connected) {
        disconnect()
        setStatus('')
      } else {
        setStatus('connecting')
        setVisible(true)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Flex flexDir="column" gap={5} alignItems="flex-start">
      <Heading fontWeight="light" display="flex" gap={2} alignItems="center">
        <Image
          height="40px"
          alt="coin"
          src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
        />
        Solana [devnet]
        <Badge
          py={1}
          px={2}
          variant={connected ? 'solid' : 'outline'}
          colorScheme={connected ? 'green' : 'red'}
        >
          {connected ? 'connected' : 'disconnected'}
        </Badge>
        {wallet && (
          <Flex ml={10} alignItems="center" gap={2}>
            <Image h="40px" alt="wallet icon" src={wallet.adapter.icon || undefined} />
            <Text>{wallet.adapter.name}</Text>
          </Flex>
        )}
        <Button
          ml={10}
          onClick={onClick}
          variant={connected ? 'outline' : undefined}
          colorScheme={connected ? 'red' : 'purple'}
        >
          {connected ? 'Disconnect' : 'Connect'} Wallet
        </Button>
      </Heading>
      {connected && status === '' ? null : (
        <Alert status={connected ? 'success' : 'info'}>
          <AlertIcon />
          {connected
            ? '😎 We have sent 1 SOL to your wallet 🔥'
            : '😎 SUMMER Promotion 🏝 - Connect your wallet today and earn 1 SOL'}
        </Alert>
      )}
    </Flex>
  )
}

export default Solana
