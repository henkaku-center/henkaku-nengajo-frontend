import type { NextPage } from 'next'
import { Box, Container, Heading } from '@chakra-ui/react'
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

function Profile() {
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

  if (isConnected) return <div>Connected to {ensName ?? address}</div>
  return <button onClick={() => connect()}>Connect Wallet</button>
}
const Home: NextPage = () => {
  return (
    <Box>
      <Container maxW="container.sm" mt="4em">
        <Heading as="h1" size="4xl">
          Henkaku Nengajo
        </Heading>
        <Profile />
      </Container>
    </Box>
  )
}



export default Home
