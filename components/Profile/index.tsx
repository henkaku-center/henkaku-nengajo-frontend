import { Box } from '@chakra-ui/react'
import { useAccount, useEnsName, } from 'wagmi'


export function Profile() {
    const { address, isConnected } = useAccount()
    const { data: ensName } = useEnsName({ address })

    if (!isConnected) return <></>
    return (

        <Box>
            Connected to {ensName ?? address}
        </Box>

    )


}
