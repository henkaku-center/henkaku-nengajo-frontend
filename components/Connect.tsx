import { Box, Button } from '@chakra-ui/react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useMounted } from '../hooks'

export function Connect() {
    const isMounted = useMounted()
    const { connector, isConnected } = useAccount()
    const { connectors, connect, isLoading, pendingConnector } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    return (
        <Box>
            {
                isConnected ? (
                    <Button onClick={() => disconnect()}> Disconnect Wallet</Button >
                ) : (
                    connectors
                        .filter((x) => isMounted && x.ready && x.id !== connector?.id)
                        .map((x) => (
                            <Button key={x.id} onClick={() => connect({ connector: x })}>
                                Connect {x.name}
                                {isLoading && x.id === pendingConnector?.id && ' (connecting)'}
                            </Button>
                        )))
            }
        </Box>
    )
}
