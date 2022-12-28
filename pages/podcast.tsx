import { Connect } from '@/components'
import { useMounted } from '@/hooks'
import { useMintNengajoWithMx } from '@/hooks/useNengajoContractMx'
import { Box, Button } from '@chakra-ui/react'
import { FC } from 'react'

const Entity = () => {
  const { sendMetaTx } = useMintNengajoWithMx()
  const submit = async () => {
    try {
      await sendMetaTx()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box>
      <Connect />
      <Button onClick={submit}>Mint</Button>
    </Box>
  )
}

const PodcastMintPage: FC = () => {
  const isMounted = useMounted()

  return isMounted ? <Entity /> : <></>
}

export default PodcastMintPage
