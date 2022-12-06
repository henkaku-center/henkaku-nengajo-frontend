import { Box, Button } from '@chakra-ui/react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
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
  const { disconnect } = useDisconnect()

  return (
    <Box>
      {isConnected ? (
        <Button onClick={() => disconnect()}> {t('BUTTON_DISCONNECT_WALLET')}</Button>
      ) : (
        connectors
          .filter((x) => isMounted && x.ready && x.id !== connector?.id)
          .map((x) => (
            <Button key={x.id} onClick={() => connect({ connector: x })}>
              {t('BUTTON_CONNECT_WALLET')} [ {x.name} ]
              {isLoading && x.id === pendingConnector?.id && ' (connecting)'}
            </Button>
          ))
      )}
    </Box>
  )
}
