import type { NextPage } from 'next'
import { Box, Flex, Text, Heading, useToast, Image } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { useMounted } from '@/hooks'
import { useRetrieveAllOmamori } from '@/hooks/useOmamoriContract'
import Layout from '@/components/Layout'
import useTranslation from 'next-translate/useTranslation'
import OmamoriesList from '@/components/OmamoriesList'
import Orb from '@/components/Naifu/Orb'
import NewlineToBr from '@/utils/NewlineToBr'

const OmamoriList: NextPage = () => {
  const isMounted = useMounted()
  const { t } = useTranslation('common')
  const { t: o } = useTranslation('omamori')
  const { isConnected } = useAccount()
  const { data: omamories, isError } = useRetrieveAllOmamori()

  const toast = useToast()
  if (isError && isConnected && !toast.isActive('RETRIEVE_NENGAJOES_FAILED'))
    toast({
      id: 'RETRIEVE_NENGAJOES_FAILED',
      title: t('CLAIM.TOAST.RETRIEVE_NENGAJOES_FAILED'),
      status: 'error',
      duration: 5000,
      position: 'top'
    })

  return (
    <Layout>
      {isMounted && omamories && (
        <Box>
          <Flex direction="column" alignItems="center" mt={10}>
            <Heading className="text_serif" size="2xl" mb={10}>
              HENKAKU
              <br />「{o('OMAMORI')}」
            </Heading>
          </Flex>
          <Flex
            marginInline="calc((100vw - 100%) * -0.5)"
            justifyContent="center"
            backgroundColor="#1A202C"
          >
            <Box
              position="relative"
              width="100%"
              maxWidth="768px"
              textAlign="center"
            >
              <Image
                src="/torii_gate.png"
                alt=""
                sx={{
                  marginTop: '-40px',
                  marginBottom: '-30px',
                  filter: `invert(100%) brightness(70%)`
                }}
              />
              <Flex
                width="100%"
                height="100%"
                position="absolute"
                left="0"
                top="0"
              >
                <Orb />
                <Orb color="#f00" highlight="#f90" delay={0.5} />
                <Orb color="#ff0" highlight="#ff9" delay={1} />
                <Orb color="#0f0" highlight="#0f9" delay={1.5} />
                <Orb color="#0ff" highlight="#9ff" delay={2} />
              </Flex>
            </Box>
          </Flex>
          <Text className="text_serif" fontSize="lg" mt={10}>
            <NewlineToBr>{o('OMAMORI_EXPLANATION')}</NewlineToBr>
          </Text>
          <Heading className="text_serif" size="lg" mt={10} mb={5}>
            {o('OMAMORI_LIST')}
          </Heading>
          {<OmamoriesList items={omamories} />}
        </Box>
      )}
    </Layout>
  )
}

export default OmamoriList
