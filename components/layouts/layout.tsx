import { ReactElement, ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import Header from '@/components/header'
import Footer from '@/components/footer'

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
        <Container maxW="container.sm" mt="4em">
          {children}
        </Container>
      </Box>
      {!disableFooter && <Footer />}
    </>
  )
}

export default Layout
