import { Box } from '@chakra-ui/react'
import { useAccount, useBalance } from 'wagmi'

export function Balance() {
  const henkakuV2 = '0x0cc91a5FFC2E9370eC565Ab42ECE33bbC08C11a2'
  const { address, isConnected } = useAccount()

  const { data } = useBalance({
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
  return (
    <Box>
      You have {data?.formatted} {data?.symbol} now.
    </Box>
  )
}
