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
    <Container>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Box>Error</Box>
      ) : (
        <Box>{data.map((nengajo) => JSON.stringify(nengajo))}</Box>
      )}
    </Container>
  )
}

const MyPage: NextPage = () => {
  const isMounted = useMounted()

  return isMounted ? <Entity /> : <></>
}

export default MyPage
