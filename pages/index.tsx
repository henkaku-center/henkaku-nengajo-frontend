import type { NextPage } from 'next'
import { Box, Container, Heading } from '@chakra-ui/react'
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useMounted, useApproval } from '@/hooks'
import Layout from '@/components/Layout'
import { Connect } from '@/components/Connect'
import { Profile } from '@/components/Profile'
import { Balance } from '@/components/Balance'
import { Approve } from '@/components/Approve'
import useTranslation from 'next-translate/useTranslation'

const Home: NextPage = () => {
  const isMounted = useMounted()
  const { t } = useTranslation('common')
  const { address, isConnected } = useAccount()
  const henkakuV2 = process.env
    .NEXT_PUBLIC_CONTRACT_HENKAKUV2_ADDRESS as `0x${string}`
  const nengajo = process.env
    .NEXT_PUBLIC_CONTRACT_NENGAJO_ADDRESS as `0x${string}`
  const { approved } = useApproval(henkakuV2, nengajo, address)

  return (
    <Layout>
      <Heading as="h1" size="4xl">
        {t('HENKAKU')} <span className="text_nengajo">{t('NENGAJO')}</span>
      </Heading>
      {isMounted && (
        <Box mt="2em">
          <Connect />
        </Box>
      )}
      {isMounted && isConnected && (
        <>
          <Box mt="2em">
            <Profile />
          </Box>
          <Box mt="2em">
            <Balance />
          </Box>
          {approved ? (
            <Box mt="2em">
              <p>
                あなたは、次のアドレスのコントラクトにHENKAKU支払いの許可を与えました（文面要検討）。 {nengajo.toString()}
              </p>
            </Box>
          ) : (
            <Box mt="2em">
              <Approve
                erc20={henkakuV2}
                spender={nengajo}
                style={{ width: '90%' }}
              >
                Approve
              </Approve>
            </Box>
          )}
        </>
      )}
    </Layout>
  )
}

export default Home
