// pages/_document.js

import { ColorModeScript } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

import { theme } from 'utils/theme'

const title = 'Quiniela'
const desc = 'Quiniela'
export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="application-name" content={title} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content={title} />
          <meta name="description" content={desc} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-config" content="/icons/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#000000" />

          <link rel="manifest" href="/manifest.json" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content={process.env.VERCEL_URL} />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={desc} />
          {/* <meta name='twitter:image' content='https://yourdomain.com/icons/android-chrome-192x192.png' /> */}
          <meta name="twitter:creator" content="@g3org3dev" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content={title} />
          <meta property="og:url" content={process.env.VERCEL_URL} />
          {/* <meta property='og:image' content='https://yourdomain.com/icons/apple-touch-icon.png' /> */}

          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
          />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} type="cookie" />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
