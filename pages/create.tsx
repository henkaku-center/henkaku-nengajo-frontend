import type { NextPage } from 'next'
import { useMounted } from '@/hooks'
import Layout from '@/components/Layout'
import { useAccount } from 'wagmi'
import useTranslation from 'next-translate/useTranslation'
import CreateNengajoForm from '@/components/CreateNengajo/Form'
import { Connect } from '@/components'

const Home: NextPage = () => {
  const isMounted = useMounted()
  const { isConnected } = useAccount()

  return (
    <Layout>
      {isMounted && !isConnected && <Connect />}
      {isMounted && isConnected && <CreateNengajoForm />}
    </Layout>
  )
}

export default Home
