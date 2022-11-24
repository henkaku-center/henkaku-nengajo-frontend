import type { NextPage } from 'next'
import { Box, Container, Heading } from '@chakra-ui/react'
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useMounted } from 'hooks'
import Layout from 'components/layouts/layout'
import { Connect } from 'components/Connect'
import { Profile } from 'components/Profile'
import { Balance } from 'components/Balance'

const Home: NextPage = () => {
  const isMounted = useMounted()
  return (
    <Layout>
      <Heading as="h1" size="4xl">
        Henkaku Nengajo
      </Heading>
      {isMounted && (
        <Box mt="2em">
          <Connect />
        </Box>
      )}
      {isMounted && (
        <Box mt="2em">
          <Profile />
        </Box>
      )}
      {isMounted && (
        <Box mt="2em">
          <Balance />
        </Box>
      )}
    </Layout>
  )
}

export default Home
