import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import '@/styles/globals.css'
import theme from '@/components/Layout/theme'
import {
  WagmiConfig,
  createClient,
  configureChains,
  chain,
  defaultChains,
  Chain
} from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

// Holesky chain definition
const holeskyChain: Chain = {
  id: 17000,
  name: 'Holesky',
  network: 'holesky',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH'
  },
  rpcUrls: {
    default: 'https://ethereum-holesky.publicnode.com'
  },
  blockExplorers: {
    default: { name: 'HoleskyScan', url: 'https://holesky.etherscan.io' }
  },
  testnet: true
} as const

const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygon, holeskyChain],
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
