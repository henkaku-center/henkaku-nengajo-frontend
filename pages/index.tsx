import type { NextPage } from 'next'
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  useToast
} from '@chakra-ui/react'
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
import CountDown from '@/components/CountDown'
import { useCountdown } from '@/hooks/useCountdown'
import Link from 'next/link'

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

  const { isStart, ...countDown } = useCountdown()

  return (
    <Layout>
      <Box textAlign="center">
        <Text fontSize="24px" fontWeight="bold" lineHeight={2}>
          {isStart ? (
            <>
              {t('TOP_MINT_START_AKEOME')}
              <br />
              {t('TOP_MINT_START_READY')}
            </>
          ) : (
            <>{t('TOP_UNTIL_START')}</>
          )}
        </Text>
        {isMounted && !isStart && <CountDown data={countDown} />}
      </Box>
      {isMounted && (
        <Box textAlign="center">
          <Box mt="2em" display="inline-block">
            {!isStart && (
              <Link href="/create">
                <Button
                  colorScheme="teal"
                  borderRadius="full"
                  mb={3}
                  width="full"
                >
                  {t('CREATE_LINK')}
                </Button>
              </Link>
            )}
            <Flex gap={6} justifyContent="center" textAlign="left">
              <Connect />
              <StatusMenu />
            </Flex>
          </Box>
        </Box>
      )}
      <Divider my={10} borderWidth="2px" />
      {isMounted && data && (
        <Box>
          <Heading size="lg" mb={5}>
            {t('REGISTERD_NENGAJO_LIST')}
          </Heading>
          {<NengajoesList items={data} />}
        </Box>
      )}
    </Layout>
  )
}

export default Home
