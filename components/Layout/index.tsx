import { ReactElement, ReactNode } from 'react'
import { Box, Container, Spinner, useToast } from '@chakra-ui/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  children: ReactElement | ReactNode
  isLoading?: boolean
  isError?: boolean
  disableHeader?: boolean
  disableFooter?: boolean
  isExternal?: boolean
}

const Layout: React.FC<Props> = ({
  children,
  isLoading,
  isError,
  disableHeader,
  disableFooter,
  isExternal
}) => {
  const { t } = useTranslation('common')
  const toast = useToast()
  return (
    <>
      {!disableHeader && <Header isExternal={isExternal} />}
      {isLoading ? (
        <Spinner />
      ) : (
        <Box minH="60vh">
          <Container maxW="container.md" mt="3em">
            {children}
          </Container>
        </Box>
      )}
      {isError &&
        toast({
          id: 'DEFAULT_ERROR',
          title: t('CLAIM.TOAST.DEFAULT_ERROR'),
          status: 'error',
          duration: 5000,
          position: 'top'
        })}
      {!disableFooter && <Footer />}
    </>
  )
}

export default Layout
