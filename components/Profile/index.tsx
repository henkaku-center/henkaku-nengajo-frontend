import { Box } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import useTranslation from 'next-translate/useTranslation'

export function Profile() {
  const { address, isConnected } = useAccount()
  const { t } = useTranslation('profile')

  if (!isConnected) return <></>
  return (
    <Box>
      {t('CONNECTED_TO')} {address}
    </Box>
  )
}
