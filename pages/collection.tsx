import Layout from '@/components/Layout'
import { useMounted } from '@/hooks'
import { useRetrieveHoldingNengajoesByAddress } from '@/hooks/useNengajoContract'
import { Box, Container, Spinner } from '@chakra-ui/react'
import { NextPage } from 'next'
import { FC } from 'react'
import { useAccount } from 'wagmi'

const Entity: FC = () => {
  const { address } = useAccount()
  const { data, isLoading, isError } = useRetrieveHoldingNengajoesByAddress(
    address!
  )
  return (
    <Layout>
      <Container>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <Box>Error</Box>
        ) : (
          <Box>{data?.map((nengajo) => JSON.stringify(nengajo))}</Box>
        )}
      </Container>
    </Layout>
  )
}

const CollectionPage: NextPage = () => {
  const isMounted = useMounted()

  return isMounted ? <Entity /> : <></>
}

export default CollectionPage
