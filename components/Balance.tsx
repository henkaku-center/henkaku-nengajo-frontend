import { Box } from '@chakra-ui/react'
import { useAccount, useBalance } from 'wagmi'

export function Balance() {
  const henkakuV2 = process.env
    .NEXT_PUBLIC_CONTRACT_HENKAKUV2_ADDRESS as `0x${string}`
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
  const { address, isConnected } = useAccount()

  const { data, isSuccess } = useBalance({
    address: address,
    token: henkakuV2,
    chainId: chainId,
    onError(error) {
      console.log('Error', error)
    },
    onSuccess(data) {
      console.log('Success', data)
    }
  })

  if (!isConnected) return <></>
  if (!isSuccess) return <>Not on proper chain?</>
  return (
    <Box>
      You have {data?.formatted} {data?.symbol} now.
    </Box>
  )
}
