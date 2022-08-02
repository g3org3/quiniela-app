import { Button, Flex, Heading, Input } from '@chakra-ui/react'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import React, { FC, useCallback } from 'react'

const Solana: FC = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError()
    const balance = await connection.getBalance(publicKey)
    const info = await connection.getAccountInfo(publicKey)
    const b = await connection.getBlock(152126366)
    const aidropSignature = await connection.requestAirdrop(publicKey, 500000000)
    const co = await connection.confirmTransaction(aidropSignature)
    console.log({ b })
    const x = await connection.getBalanceAndContext(publicKey)
    console.log({ balance, info, key: publicKey.toString(), x })
    const d = {
      fromPubkey: publicKey,
      toPubkey: new PublicKey('6Bv1GbTeoFm5HEYGuwNfvHUbnEbM5UV5evCweWuFXDm6'),
      lamports: 500000000,
    }
    console.log(d)
    const transaction = new Transaction().add(SystemProgram.transfer(d))
    console.log(transaction)
    try {
      const signature = await sendTransaction(transaction, connection)
      console.log({ signature })
      const x = await connection.confirmTransaction(signature, 'processed')

      console.log('success', x)
    } catch (err) {
      console.log('failed', err.message)
    }
  }, [publicKey, sendTransaction, connection])

  return (
    <Flex flexDir="column" gap={5} alignItems="flex-start">
      <Heading fontWeight="light">Solana | Add your wallet</Heading>
      <WalletMultiButton style={{ height: '40px' }} />
      <Flex gap={2} w="60%">
        <Input type="password" value="6Bv1GbTeoFm5HEYGuwNfvHUbnEbM5UV5evCweWuFXDm6" />
        <Button colorScheme="blue" onClick={onClick} disabled={!publicKey}>
          Send
        </Button>
      </Flex>
    </Flex>
  )
}

export default Solana
