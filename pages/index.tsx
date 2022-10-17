import type { NextPage } from 'next'
import { Box, Container, Heading } from '@chakra-ui/react'

const Home: NextPage = () => {
  return (
    <Box>
      <Container maxW="container.sm" mt="4em">
        <Heading as="h1" size="4xl">
          Henkaku Nengajo
        </Heading>
      </Container>
    </Box>
  )
}

export default Home
