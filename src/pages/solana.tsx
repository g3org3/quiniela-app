import {
  Alert,
  Text,
  AlertIcon,
  Badge,
  Button,
  Flex,
  Heading,
  Image,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useEffect, useState } from 'react'

const SOL = 1000000000
const Solana = () => {
  const { connection } = useConnection()
  const toast = useToast()
  const { visible, setVisible } = useWalletModal()
  const { wallet, disconnect, connected, publicKey, connecting } = useWallet()
  const [status, setStatus] = useState<'' | 'connecting' | 'sent'>('')

  useEffect(() => {
    if (!connected && !visible) {
      setStatus('')
    }
  }, [visible])

  useEffect(() => {
    const main = async () => {
      if (connected && status === 'connecting' && publicKey) {
        try {
          const aidropSignature = await connection.requestAirdrop(publicKey, 1 * SOL)
          await connection.confirmTransaction(aidropSignature)
          toast({ title: '1 SOL Sent!', status: 'success' })
          setStatus('sent')
        } catch (err: any) {
          toast({ title: 'Something went wrong', status: 'error', description: err?.message || err })
        }
      }
    }
    main().catch(() => {})
  }, [connected, status, publicKey, connection, toast])

  const onClick = async () => {
    if (connected) {
      disconnect()
      setStatus('')
    } else {
      setStatus('connecting')
      setVisible(true)
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
        Solana
        <Text ml={-2} mt={2} alignSelf="flex-start" fontSize="12px">
          [devnet]
        </Text>
        <Badge variant={connected ? 'solid' : 'subtle'} colorScheme={connected ? 'green' : 'red'}>
          {connected ? 'connected' : 'not connected'}
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
          colorScheme={connected ? 'red' : undefined}
        >
          {connected ? 'Disconnect' : 'Connect'} Wallet
        </Button>
      </Heading>
      {connected && status === '' ? null : (
        <Alert status={connected && status === 'sent' ? 'success' : 'info'}>
          {status === 'connecting' ? <Spinner mr={2} /> : <AlertIcon />}
          {status === 'sent' && '😎 We have sent 1 SOL to your wallet 🔥'}
          {status == 'connecting' && 'Checking'}
          {status === '' && '😎 SUMMER Promotion 🏝 - Connect your wallet today and earn 1 SOL'}
        </Alert>
      )}
    </Flex>
  )
}

export default Solana
