import type { NextPage } from 'next'
import {
  Box,
  Flex,
  Text,
  Heading,
  useToast,
  Image,
  Button
} from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { useMounted } from '@/hooks'
import {
  useRetrieveAllOmamori,
  useSetApprovalForAllOmamoriWithMx
} from '@/hooks/useOmamoriContract'
import Layout from '@/components/Layout'
import useTranslation from 'next-translate/useTranslation'
import OmamoriesList from '@/components/OmamoriesList'
import Orb from '@/components/Naifu/Orb'
import NewlineToBr from '@/utils/NewlineToBr'
import {
  useOtakiage,
  useSendAllOmamoriWithMx
} from '@/hooks/useOtakiageContract'

const OtakiagePage: NextPage = () => {
  const isMounted = useMounted()
  const { t } = useTranslation('common')
  const { t: ot } = useTranslation('otakiage')
  const { isConnected } = useAccount()
  const { data: omamories, isError } = useRetrieveAllOmamori()
  const {
    sendMetaTx: approveMetaTx,
    isLoading: isApproving,
    approved
  } = useSetApprovalForAllOmamoriWithMx()
  const {
    sendMetaTx: sendAllOmamoriMetaTx,
    isLoading: isSending,
    sent
  } = useSendAllOmamoriWithMx()
  const {
    isLoading: isLoadingOtakiage,
    isSuccess: isSuccessOtakiage,
    writeAsync: otakiageWriteAsync,
    otakiaged
  } = useOtakiage()

  const toast = useToast()
  if (isError && isConnected && !toast.isActive('RETRIEVE_NENGAJOES_FAILED'))
    toast({
      id: 'RETRIEVE_NENGAJOES_FAILED',
      title: t('CLAIM.TOAST.RETRIEVE_NENGAJOES_FAILED'),
      status: 'error',
      duration: 5000,
      position: 'top'
    })

  const approve = async () => {
    try {
      await approveMetaTx()
    } catch (error: any) {
      toast({
        id: 'APPROVE_FAILED',
        title: error?.message,
        status: 'error',
        duration: 5000,
        position: 'top'
      })
    }
  }

  const sendAllOmamori = async () => {
    try {
      await sendAllOmamoriMetaTx()
    } catch (error: any) {
      toast({
        id: 'SEND_ALL_OMAMORI_FAILED',
        title: error?.message,
        status: 'error',
        duration: 5000,
        position: 'top'
      })
    }
  }

  const otakiage = async () => {
    try {
      if (!otakiageWriteAsync) return
      await otakiageWriteAsync()
    } catch (error: any) {
      toast({
        id: 'OTAKIAGE_FAILED',
        title: error?.message,
        status: 'error',
        duration: 5000,
        position: 'top'
      })
    }
  }

  return (
    <Layout>
      {isMounted && omamories && (
        <Box>
          <Flex direction="column" alignItems="center" mt={10}>
            <Heading className="text_serif" size="2xl" mb={10}>
              HENKAKU
              <br />「{ot('OTAKIAGE')}」
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
          {/* <Text className="text_serif" fontSize="lg" mt={10}>
            <NewlineToBr>{ot('OMAMORI_EXPLANATION')}</NewlineToBr>
          </Text> */}
          <Flex
            justifyContent="center"
            alignItems="center"
            direction="column"
            mt={10}
            pb={100}
            maxWidth="240px"
            margin="0 auto"
            gap={10}
          >
            <Button
              w="100%"
              loadingText="approving..."
              isLoading={isApproving}
              onClick={approve}
            >
              {ot('JOIN')}
            </Button>
            <Button
              w="100%"
              loadingText="sending..."
              isLoading={isSending}
              onClick={sendAllOmamori}
            >
              {ot('SEND_OMAMORI')}
            </Button>
            <Button
              w="100%"
              loadingText="otakiage..."
              isLoading={isLoadingOtakiage}
              onClick={otakiage}
            >
              {ot('OTAKIAGE')}
            </Button>
          </Flex>
        </Box>
      )}
    </Layout>
  )
}

export default OtakiagePage
