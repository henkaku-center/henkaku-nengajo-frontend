import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { Box, Button, Text } from '@chakra-ui/react'
import { useMounted } from '@/hooks'
import { Connect } from '@/components/Connect'
import Layout from '@/components/Layout'
import MintNengajo, { PreviewNengajo } from '@/components/MintNengajo'
import { useRetrieveNengajo } from '@/hooks/useNengajoContract'

const NengajoDetail: NextPage = () => {
  const isMounted = useMounted()
  const { isConnected } = useAccount()
  const router = useRouter()
  const { id } = router.query

  const { data } = useRetrieveNengajo(Number(id))

  return (
    <Layout>
      <Box>
        <Text>MetadataURI: {data.uri}</Text>
        <Text>Creator Address: {data.creator}</Text>
        <Text>MaxSupply: {data.maxSupply.toNumber()}</Text>
      </Box>

      {isMounted && !isConnected && (
        <Box>
          <Connect />
        </Box>
      )}
      {isMounted && isConnected && (
        <>{router.query?.id && <MintNengajo id={String(id)} />}</>
      )}

      {/* プレビュー機能のテスト（削除予定） */}
      {isMounted && isConnected && (
        <Box mt={5}>
          <PreviewNengajo id={String(id)}>
            <Button>Modal Test</Button>
          </PreviewNengajo>
        </Box>
      )}
    </Layout>
  )
}

export default NengajoDetail
