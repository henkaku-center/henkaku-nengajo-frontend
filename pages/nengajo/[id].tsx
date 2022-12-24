import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { Box } from '@chakra-ui/react'
import { useMounted } from '@/hooks'
import { Connect } from '@/components/Connect'
import Layout from '@/components/Layout'
import ErrorComponent from 'next/error'
import MintNengajo from '@/components/MintNengajo'
import { useRetrieveNengajoByTokenId } from '@/hooks/useNengajoContract'
import { useNengajoInfo } from '@/hooks/useNengajoInfo'

const NengajoDetail: NextPage = () => {
  const isMounted = useMounted()
  const { isConnected } = useAccount()
  const router = useRouter()
  const { id } = router.query
  const { data, isError } = useRetrieveNengajoByTokenId(Number(id))
  const { nengajoInfo } = useNengajoInfo(data)

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
          {router.query?.id && nengajoInfo && (
            <MintNengajo id={Number(id)} item={nengajoInfo} />
          )}
        </>
      )}
    </Layout>
  )
}

export default NengajoDetail
