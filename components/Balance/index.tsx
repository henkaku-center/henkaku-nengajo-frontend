import { Box, Divider } from '@chakra-ui/react'
import { useAccount, useBalance } from 'wagmi'
import { getContractAddress } from '@/utils/contractAddresses'
import { useChainId } from '@/hooks'
import useTranslation from 'next-translate/useTranslation'

export const Balance = () => {
  const { chainId, wrongNetwork } = useChainId()
  const { t } = useTranslation('balance')
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
    }
    // onSuccess(data) {
    //   console.log('Success', data)
    // }
  })

  if (!isConnected) return <></>
  return (
    <>
      <Box mt={3} mb={3}>
        {wrongNetwork ? (
          <Box>{t('NOT_EXPECTED_CHAIN')}</Box>
        ) : !isSuccess ? (
          <Box>{t('BALANCE_CHECK_FAILED')}</Box>
        ) : (
          t('BALANCE', { balance: data?.formatted, symbol: data?.symbol })
        )}
      </Box>
      <Divider />
    </>
  )
}
