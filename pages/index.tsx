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
import { useMounted } from '@/hooks'
import { useRetrieveAllNengajo } from '@/hooks/useNengajoContract'
import Layout from '@/components/Layout'
import { Connect } from '@/components/Connect'
import NengajoesList from '@/components/NengajoesList'
import StatusMenu from '@/components/StatusMenu'
import useTranslation from 'next-translate/useTranslation'
import CountDown from '@/components/CountDown'
import { useCountdown } from '@/hooks/useCountdown'
import Link from 'next/link'
import { useMemo } from 'react'
import { HIDE_NENGAJO_LIST } from '@/constants/Nengajo'

const Home: NextPage = () => {
  const isMounted = useMounted()
  const { t } = useTranslation('common')
  const { isConnected } = useAccount()
  const { data, isError } = useRetrieveAllNengajo()

  const filteredNengajo = useMemo(() => {
    return (
      data?.filter((n) => !HIDE_NENGAJO_LIST.includes(n.id.toNumber())) || []
    )
  }, [data])

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
                  size="lg"
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
      {isMounted && filteredNengajo && (
        <Box>
          <Heading size="lg" mb={5}>
            {t('REGISTERD_NENGAJO_LIST')}
          </Heading>
          {<NengajoesList items={filteredNengajo} />}
        </Box>
      )}
    </Layout>
  )
}

export default Home
