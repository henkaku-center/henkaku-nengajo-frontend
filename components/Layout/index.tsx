import { ReactElement, ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Props {
  children: ReactElement | ReactNode
  disableHeader?: boolean
  disableFooter?: boolean
}

const Layout: React.FC<Props> = ({
  children,
  disableHeader,
  disableFooter
}) => {
  return (
    <>
      {!disableHeader && <Header />}
      <Box minH="60vh">
        <Container maxW="container.md" mt="4em">
          {children}
        </Container>
      </Box>
      {!disableFooter && <Footer />}
    </>
  )
}

export default Layout
