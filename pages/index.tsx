import type { NextPage } from 'next'
import { Box, Container, Heading } from '@chakra-ui/react'
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useMounted } from '@/hooks'
import Layout from '@/components/Layout'
import { Connect } from '@/components/Connect'
import { Profile } from '@/components/Profile'
import { Balance } from '@/components/Balance'
import useTranslation from 'next-translate/useTranslation'

const Home: NextPage = () => {
  const isMounted = useMounted()
  const { t } = useTranslation('common')
  return (
    <Layout>
      <Heading as="h1" size="4xl">
        HENKAKU <span className="text_nengajo">{t('NENGAJO')}</span>
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
