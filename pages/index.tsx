import type { NextPage } from 'next'
import { Box, Divider, Flex, useToast } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { useMounted } from '@/hooks'
// import { useRetrieveAllNengajo } from '@/hooks/useNengajoContract'
import Layout from '@/components/Layout'
// import { Connect } from '@/components/Connect'
// import NengajoesList from '@/components/NengajoesList'
// import StatusMenu from '@/components/StatusMenu'
import useTranslation from 'next-translate/useTranslation'
// import CountDown from '@/components/CountDown'
// import { useCountdown } from '@/hooks/useCountdown'
// import Link from 'next/link'
// import { useMemo } from 'react'
// import { HIDE_NENGAJO_LIST } from '@/constants/Nengajo'
import { Connect } from '@/components'
import StatusMenu from '@/components/StatusMenu'
import OtakiageFeature from '@/components/OtakiageFeature'

const Home: NextPage = () => {
  const isMounted = useMounted()
  const { t } = useTranslation('common')
  const { isConnected, address } = useAccount()
  // const { data, isError } = useRetrieveAllNengajo()

  // const filteredNengajo = useMemo(() => {
  //   return data?.filter((n) => !HIDE_NENGAJO_LIST.includes(n.id.toNumber()))
  // }, [data])

  const toast = useToast()

  // if (isError && isConnected && !toast.isActive('RETRIEVE_NENGAJOES_FAILED'))
  //   toast({
  //     id: 'RETRIEVE_NENGAJOES_FAILED',
  //     title: t('CLAIM.TOAST.RETRIEVE_NENGAJOES_FAILED'),
  //     status: 'error',
  //     duration: 5000,
  //     position: 'top'
  //   })

  // if (isConnected && !toast.isActive('RETRIEVE_NENGAJOES_FAILED'))
  //   toast({
  //     id: 'RETRIEVE_NENGAJOES_FAILED',
  //     title: t('CLAIM.TOAST.RETRIEVE_NENGAJOES_FAILED'),
  //     status: 'error',
  //     duration: 5000,
  //     position: 'top'
  //   })

  return (
    <Layout>
      {isMounted && <OtakiageFeature />}
      {/* {isMounted && filteredNengajo && (
        <Box>
          <Heading size="lg" mb={5}>
            {t('REGISTERD_NENGAJO_LIST')}
          </Heading>
          {<NengajoesList items={filteredNengajo} />}
        </Box>
      )} */}
    </Layout>
  )
}

export default Home
