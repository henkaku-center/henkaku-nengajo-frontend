import { Box, Button } from '@chakra-ui/react'
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useMounted } from '../../hooks'
import useTranslation from 'next-translate/useTranslation'

export function Connect() {
  const { t } = useTranslation('connect')
  const isMounted = useMounted()
  const { connector, isConnected } = useAccount()
  const { connectors, connect, isLoading, pendingConnector } = useConnect({
    connector: new InjectedConnector()
  })

  return (
    <Box>
      {isConnected ? (
        /** walletが接続されている場合、disconnectボタンは同位置には表示しない */
        <></>
      ) : (
        connectors
          .filter((x) => isMounted && x.ready && x.id !== connector?.id)
          .map((x) => (
            <Button
              size="lg"
              colorScheme="teal"
              borderRadius="full"
              key={x.id}
              onClick={() => connect({ connector: x })}
            >
              {t('BUTTON_CONNECT_WALLET')}
              {isLoading &&
                x.id === pendingConnector?.id &&
                `: ${t('CONNECTING')}`}
            </Button>
          ))
      )}
    </Box>
  )
}
