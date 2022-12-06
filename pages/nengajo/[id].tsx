import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { Box, Button } from '@chakra-ui/react'
import { useMounted } from '@/hooks'
import { Connect } from '@/components/Connect'
import Layout from '@/components/Layout'
import MintNengajo, { PreviewNengajo } from '@/components/MintNengajo'

const NengajoDetail: NextPage = () => {
  const isMounted = useMounted()
  const { isConnected } = useAccount()
  const router = useRouter()
  const { id } = router.query

  return (
    <Layout>
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
