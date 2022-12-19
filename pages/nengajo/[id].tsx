import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { Box } from '@chakra-ui/react'
import { useMounted } from '@/hooks'
import { Connect } from '@/components/Connect'
import Layout from '@/components/Layout'
import MintNengajo from '@/components/MintNengajo'
import { useRetrieveNengajo } from '@/hooks/useNengajoContract'
import { useNengajoInfo } from '@/hooks/useNengajoInfo'
import ErrorComponent from 'next/error'

const NengajoDetail: NextPage = () => {
  const isMounted = useMounted()
  const { isConnected } = useAccount()
  const router = useRouter()
  const { id } = router.query
  const { data, isError } = useRetrieveNengajo(Number(id))
  const { nengajoInfo } = useNengajoInfo(data)

  if (isError) return <ErrorComponent statusCode={404} />
  return (
    <Layout>
      {isMounted && !isConnected && (
        <Box>
          <Connect />
        </Box>
      )}
      {isMounted && isConnected && (
        <>
          {router.query?.id && nengajoInfo && (
            <MintNengajo item={nengajoInfo} />
          )}
        </>
      )}
    </Layout>
  )
}

export default NengajoDetail
