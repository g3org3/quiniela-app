// import { useWallet } from '@solana/wallet-adapter-react'
// import { Button } from '@solana/wallet-adapter-react-ui'
// import type { FC, MouseEventHandler } from 'react'
// import React, { useCallback, useMemo } from 'react'

// interface Props {
//   //
// }

// const SolanaButton = ({ children, disabled, onClick, ...props }: Props) => {
//   const { wallet, connect, connecting, connected } = useWallet()

//   const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
//     (event) => {
//       if (onClick) onClick(event)
//       // eslint-disable-next-line @typescript-eslint/no-empty-function
//       if (!event.defaultPrevented) connect().catch(() => {})
//     },
//     [onClick, connect]
//   )

//   const content = useMemo(() => {
//     if (children) return children
//     if (connecting) return 'Connecting ...'
//     if (connected) return 'Connected'
//     if (wallet) return 'Connect'

//     return 'Connect Wallet'
//   }, [children, connecting, connected, wallet])

//   return (
//     <Button
//       className="wallet-adapter-button-trigger"
//       disabled={disabled || !wallet || connecting || connected}
//       startIcon={wallet ? <WalletIcon wallet={wallet} /> : undefined}
//       onClick={handleClick}
//       {...props}
//     >
//       {content}
//     </Button>
//   )
// }

// export default SolanaButton
