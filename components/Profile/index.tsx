import { Box, Divider, Text } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import useTranslation from 'next-translate/useTranslation'

export const Profile = () => {
  const { address, isConnected } = useAccount()
  const { t } = useTranslation('profile')

  return (
    <>
      <Box mt={3} mb={3}>
        <Text>
          {t('CONNECTION')}
          {isConnected ? (
            <>
              OK：
              {t('CONNECTED_TO')}
              <br />
              {address}
            </>
          ) : (
            <>
              NG
              <br />
              {t('CONNECTED_FAILD_DESCRIPTION')}
            </>
          )}
        </Text>
      </Box>
      <Divider />
    </>
  )
}
