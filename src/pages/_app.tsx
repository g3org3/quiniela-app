// src/pages/_app.tsx
import { ChakraProvider } from '@chakra-ui/react'
import { withTRPC } from '@trpc/next'
import { SessionProvider } from 'next-auth/react'
import type { AppType } from 'next/dist/shared/lib/utils'
import Head from 'next/head'
import superjson from 'superjson'

import Layout from 'components/Layout'
import SolanaProvider from 'components/SolanaProvider'
import type { AppRouter } from 'server/router'
import { theme } from 'utils/theme'

import 'styles/globals.css'

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <ChakraProvider theme={theme}>
        <SessionProvider session={session}>
          <SolanaProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SolanaProvider>
        </SessionProvider>
      </ChakraProvider>
    </>
  )
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return ''
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp)
