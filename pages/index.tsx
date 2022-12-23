import type { NextPage } from 'next'
import { Box, Flex, Heading, Text, useToast } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { useMounted, useApproval, useChainId } from '@/hooks'
import { useRetrieveAllNengajo } from '@/hooks/useNengajoContract'
import { getContractAddress } from '@/utils/contractAddresses'
import Layout from '@/components/Layout'
import { Connect } from '@/components/Connect'
import { Approve } from '@/components/Approve'
import NengajoesList from '@/components/NengajoesList'
import StatusMenu from '@/components/StatusMenu'
import useTranslation from 'next-translate/useTranslation'

const Home: NextPage = () => {
  const { chainId, wrongNetwork } = useChainId()
  const henkakuV2 = getContractAddress({
    name: 'henkakuErc20',
    chainId: chainId
  }) as `0x${string}`
  const nengajo = getContractAddress({
    name: 'nengajo',
    chainId: chainId
  }) as `0x${string}`
  const isMounted = useMounted()
  const { t } = useTranslation('common')
  const { address, isConnected } = useAccount()
  const { approved } = useApproval(henkakuV2, nengajo, address)
  const { data, isError } = useRetrieveAllNengajo()

  const toast = useToast()
  if (isError && isConnected && !toast.isActive('RETRIEVE_NENGAJOES_FAILED'))
    toast({
      id: 'RETRIEVE_NENGAJOES_FAILED',
      title: t('CLAIM.TOAST.RETRIEVE_NENGAJOES_FAILED'),
      status: 'error',
      duration: 5000,
      position: 'top'
    })

  return (
    <Layout>
      <Heading as="h1" size="4xl">
        {t('HENKAKU')} <span className="text_nengajo">{t('NENGAJO')}</span>
      </Heading>
      {isMounted && (
        <Box mt="2em">
          <Flex gap={6}>
            <Connect />
            <StatusMenu />
          </Flex>
        </Box>
      )}
      {isMounted && data && (
        <Box mt={10}>
          <Heading size="xl" mb={5}>
            {t('REGISTERD_NENGAJO_LIST')}
          </Heading>
          {<NengajoesList items={data} />}
        </Box>
      )}
    </Layout>
  )
}

export default Home
