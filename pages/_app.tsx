import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import '@/styles/globals.css'
import theme from '@/components/Layout/theme'
import {
  WagmiConfig,
  createClient,
  configureChains,
  chain,
  defaultChains
} from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon, chain.hardhat, chain.polygonMumbai],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: process.env.NEXT_PUBLIC_JSONRPC_HTTP!,
        webSocket: process.env.NEXT_PUBLIC_JSONRPC_WS!
      }),
      priority: 0
    }),
    publicProvider({ priority: 1 })
  ]
)
const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider
})
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </WagmiConfig>
  )
}

export default MyApp
