import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { useCallback } from 'react'

export const useSolana = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError()
    const balance = await connection.getBalance(publicKey)
    const info = await connection.getAccountInfo(publicKey)
    const b = await connection.getBlock(152126366)
    const aidropSignature = await connection.requestAirdrop(publicKey, 500000000)
    const co = await connection.confirmTransaction(aidropSignature)
    const x = await connection.getBalanceAndContext(publicKey)
    const d = {
      fromPubkey: publicKey,
      toPubkey: new PublicKey('6Bv1GbTeoFm5HEYGuwNfvHUbnEbM5UV5evCweWuFXDm6'),
      lamports: 500000000,
    }
    const transaction = new Transaction().add(SystemProgram.transfer(d))
    try {
      const signature = await sendTransaction(transaction, connection)
      const x = await connection.confirmTransaction(signature, 'processed')
    } catch (err: any) {
      //
    }
  }, [publicKey, sendTransaction, connection])
}
