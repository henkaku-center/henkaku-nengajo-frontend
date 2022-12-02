import { Box } from '@chakra-ui/react'
import { useAccount, useBalance } from 'wagmi'
import { getContractAddress } from '../utils/contractAddresses'
import { useChainId } from '../hooks'

export function Balance() {
  const { chainId, wrongNetwork } = useChainId()
  const henkakuV2 = getContractAddress({
    name: 'henkakuErc20',
    chainId: chainId
  }) as `0x${string}`

  const { address, isConnected } = useAccount()

  const { data, isSuccess } = useBalance({
    address: address,
    token: henkakuV2,
    chainId: chainId,
    onError(error) {
      console.error('Error checking ERC-20 balance')
      console.error('address', address)
      console.error('token', henkakuV2)
      console.error('chainId', chainId)
      console.error(error)
    },
    onSuccess(data) {
      console.log('Success', data)
    }
  })

  if (!isConnected) return <></>
  if (wrongNetwork) return <>Not on expected chain</>
  if (!isSuccess) return <>Balance check failed</>
  return (
    <Box>
      You have {data?.formatted} {data?.symbol} now.
    </Box>
  )
}
