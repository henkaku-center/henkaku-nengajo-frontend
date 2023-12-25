import {
  DefenderRelayProvider,
  DefenderRelaySigner
} from '@openzeppelin/defender-relay-client/lib/ethers'
import { providers, Wallet } from 'ethers'

const credentials = {
  apiKey: process.env.OZ_RELAYER_API_KEY!,
  apiSecret: process.env.OZ_RELAYER_API_SECRET!
}

export const ozSigner = () => {
  const ozProvider = new DefenderRelayProvider(credentials)
  return new DefenderRelaySigner(credentials, ozProvider, {
    speed: 'fast'
  })
}

export const developmentSigner = () => {
  if (!process.env.DEVELOPMENT_RELAYER_PRIVATE_KEY) return
  const developmentProvider = new providers.JsonRpcProvider(
    'http://localhost:8545'
  )
  return new Wallet(
    process.env.DEVELOPMENT_RELAYER_PRIVATE_KEY!,
    developmentProvider
  )
}
