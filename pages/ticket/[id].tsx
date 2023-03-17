import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { Box } from '@chakra-ui/react'
import { useMounted } from '@/hooks'
import { Connect } from '@/components/Connect'
import Layout from '@/components/Layout'
import ErrorComponent from 'next/error'
import MintTicket from '@/components/MintTicket'
import { useRetrieveTicketByTokenId } from '@/hooks/useTicketContract'
import { useTicketInfo } from '@/hooks/useTicketInfo'

const TicketDetail: NextPage = () => {
  const isMounted = useMounted()
  const { isConnected } = useAccount()
  const router = useRouter()
  const { id } = router.query
  const { data, isError } = useRetrieveTicketByTokenId(Number(id))
  const { ticketInfo } = useTicketInfo(data)

  if (isError) return <ErrorComponent statusCode={404} />

  return (
    <Layout>
      {isMounted && !isConnected && (
        <Box>
          <Connect />
        </Box>
      )}
      {isMounted && (
        <>
          {router.query?.id && ticketInfo && (
            <MintTicket id={Number(id)} item={ticketInfo} />
          )}
        </>
      )}
    </Layout>
  )
}

export default TicketDetail
