import { Box } from '@chakra-ui/react'
import { useAccount, useBalance, useNetwork } from 'wagmi'
import { getContractAddress } from '../utils/contractAddress'

export function Balance() {
  const { chain } = useNetwork()

  const henkakuV2 = getContractAddress({
    name: 'henkakuErc20',
    chainId: chain?.id
  }) as `0x${string}`

  const { address, isConnected } = useAccount()

  const { data, isSuccess } = useBalance({
    address: address,
    token: henkakuV2,
    onError(error) {
      console.log('Error', error)
    },
    onSuccess(data) {
      console.log('Success', data)
    }
  })

  if (!isConnected) return <></>
  if (!isSuccess) return <>Not on Polygon?</>
  return (
    <Box>
      You have {data?.formatted} {data?.symbol} now.
    </Box>
  )
}
