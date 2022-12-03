import { Box } from '@chakra-ui/react'
import { useAccount } from 'wagmi'

export function Profile() {
  const { address, isConnected } = useAccount()

  if (!isConnected) return <></>
  return <Box>Connected to {address}</Box>
}
