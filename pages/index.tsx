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
import { useRetrieveAllTicket } from '@/hooks/useTicketContract'
import Layout from '@/components/Layout'
import { Connect } from '@/components/Connect'
import TicketsList from '@/components/TicketsList'
import StatusMenu from '@/components/StatusMenu'
import useTranslation from 'next-translate/useTranslation'
import CountDown from '@/components/CountDown'
import { useCountdown } from '@/hooks/useCountdown'
import Link from 'next/link'
import { useMemo } from 'react'
import { HIDE_TICKET_LIST } from '@/constants/Ticket'

const Home: NextPage = () => {
  const isMounted = useMounted()
  const { t } = useTranslation('common')
  const { isConnected } = useAccount()
  const { data, isError } = useRetrieveAllTicket()

  const filteredTicket = useMemo(() => {
    return data?.filter((n) => !HIDE_TICKET_LIST.includes(n.id.toNumber()))
  }, [data])

  const toast = useToast()
  if (isError && isConnected && !toast.isActive('RETRIEVE_TICKETS_FAILED'))
    toast({
      id: 'RETRIEVE_TICKETS_FAILED',
      title: t('CLAIM.TOAST.RETRIEVE_TICKETS_FAILED'),
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
      {isMounted && filteredTicket && (
        <Box>
          <Heading size="lg" mb={5}>
            {t('REGISTERD_TICKET_LIST')}
          </Heading>
          {<TicketsList items={filteredTicket} />}
        </Box>
      )}
    </Layout>
  )
}

export default Home
