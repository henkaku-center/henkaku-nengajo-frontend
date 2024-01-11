import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { Box } from '@chakra-ui/react'
import { useMounted } from '@/hooks'
import { Connect } from '@/components/Connect'
import Layout from '@/components/Layout'
import ErrorComponent from 'next/error'
import MintOmamori from '@/components/MintOmamori'
import { useRetrieveOmamoriByTokenId } from '@/hooks/useOmamoriContract'
import { useOmamoriInfo } from '@/hooks/useOmamoriInfo'

const OmamoriDetail: NextPage = () => {
  const isMounted = useMounted()
  const { isConnected } = useAccount()
  const router = useRouter()
  const { id } = router.query
  const { data, isError } = useRetrieveOmamoriByTokenId(Number(id))
  const { omamoriInfo } = useOmamoriInfo(data)

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
          {router.query?.id && omamoriInfo && (
            <MintOmamori id={Number(id)} item={omamoriInfo} />
          )}
        </>
      )}
    </Layout>
  )
}

export default OmamoriDetail
