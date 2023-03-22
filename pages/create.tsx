import type { NextPage } from 'next'
import { useMounted } from '@/hooks'
import Layout from '@/components/Layout'
import { useAccount } from 'wagmi'
import CreateTicketForm from '@/components/CreateTicket/Form'
import { Connect } from '@/components'
import { Heading } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'

const Home: NextPage = () => {
  const { t } = useTranslation('common')
  const isMounted = useMounted()
  const { isConnected } = useAccount()

  return (
    <Layout>
      <Heading as="h2">{t('CREATE_NEW_TICKET')}</Heading>
      {isMounted && !isConnected && <Connect />}
      {isMounted && isConnected && <CreateTicketForm />}
    </Layout>
  )
}

export default Home
