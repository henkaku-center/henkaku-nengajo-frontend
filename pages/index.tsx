import type { NextPage } from 'next'
import {
  Box,
  Button,
  // Divider,
  Flex,
  Heading,
  Text,
  useToast,
  Image
} from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { useChainId, useMounted } from '@/hooks'
// import { useRetrieveAllNengajo } from '@/hooks/useNengajoContract'
import Layout from '@/components/Layout'
// import { Connect } from '@/components/Connect'
// import NengajoesList from '@/components/NengajoesList'
// import StatusMenu from '@/components/StatusMenu'
import useTranslation from 'next-translate/useTranslation'
// import CountDown from '@/components/CountDown'
// import { useCountdown } from '@/hooks/useCountdown'
import {
  useFetchUserOmamori,
  useIsApprovedForAllToOtakiage,
  useSetApprovalForAllOmamoriWithMx
} from '@/hooks/useOmamoriContract'
import {
  useIsAdmin,
  useIsOtakiaged,
  useOtakiage,
  useSendAllOmamoriWithMx
} from '@/hooks/useOtakiageContract'
// import Link from 'next/link'
// import { useMemo } from 'react'
// import { HIDE_NENGAJO_LIST } from '@/constants/Nengajo'
import Orb from '@/components/Naifu/Orb'
import { IS_EVENT_DAY, IS_RELEASED } from '@/constants/Otakiage'
import OmamoriesList from '@/components/OmamoriesList'
import Link from 'next/link'
import { Connect } from '@/components'
import StatusMenu from '@/components/StatusMenu'
import { contractAddresses, holeskyChainId } from '@/utils/contractAddresses'

const Home: NextPage = () => {
  const isMounted = useMounted()
  const { chainId } = useChainId()
  const { t } = useTranslation('common')
  const { isConnected, address } = useAccount()
  // const { data, isError } = useRetrieveAllNengajo()

  // const filteredNengajo = useMemo(() => {
  //   return data?.filter((n) => !HIDE_NENGAJO_LIST.includes(n.id.toNumber()))
  // }, [data])

  const toast = useToast()
  const { userMintedOmamories, userHoldingOmamories, isError } =
    useFetchUserOmamori()
  const {
    sendMetaTx: approveMetaTx,
    isLoading: isApproving,
    isSuccess: isSuccessApprove
  } = useSetApprovalForAllOmamoriWithMx()
  const {
    sendMetaTx: sendAllOmamoriMetaTx,
    isLoading: isSending,
    isSuccess: isSuccessSendAllOmamori
  } = useSendAllOmamoriWithMx()
  const {
    isLoading: isLoadingOtakiage,
    isSuccess: isSuccessOtakiage,
    writeAsync: otakiageWriteAsync,
    otakiaged
  } = useOtakiage()
  const { isAdmin } = useIsAdmin()
  const { data: isApproved } = useIsApprovedForAllToOtakiage()

  // if (isError && isConnected && !toast.isActive('RETRIEVE_NENGAJOES_FAILED'))
  //   toast({
  //     id: 'RETRIEVE_NENGAJOES_FAILED',
  //     title: t('CLAIM.TOAST.RETRIEVE_NENGAJOES_FAILED'),
  //     status: 'error',
  //     duration: 5000,
  //     position: 'top'
  //   })
  const { t: ot } = useTranslation('otakiage')
  const { isOtakiaged } = useIsOtakiaged()

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

  const scanDomain = () => {
    switch (chainId) {
      case 137: // polygon
        return 'https://polygonscan.com'
      case holeskyChainId: // holesky
        return 'https://holesky.etherscan.io'
      default:
        return 'https://holesky.etherscan.io'
    }
  }

  const otakiageOmamoriScanUrl = `${scanDomain()}/address/${
    contractAddresses.otakiage[chainId]
  }#readContract#F7`

  return (
    <Layout>
      {isMounted && (
        <Box>
          <Box textAlign="center">
            <Box mt="2em" display="inline-block">
              <Flex gap={6} justifyContent="center" textAlign="left">
                <Connect />
                <StatusMenu />
              </Flex>
            </Box>
          </Box>
          <Flex direction="column" alignItems="center" mt={10}>
            <Heading
              className="text_serif"
              size="2xl"
              mb={10}
              textAlign="center"
              width="100%"
            >
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
          {address && (
            <>
              {!isOtakiaged && (
                <>
                  <Heading className="text_serif" size="xl" mt={10} pb={10}>
                    {ot('USER_OMAMORI_LIST')}
                  </Heading>
                  <Box mt={0} pb={20}>
                    {<OmamoriesList items={userMintedOmamories} />}
                  </Box>
                  {(IS_RELEASED ||
                    isAdmin ||
                    !(process.env.NODE_ENV === 'production')) && (
                    <>
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
                        {userMintedOmamories &&
                          userMintedOmamories.length > 0 && (
                            <>
                              {!isApproved && !isSuccessApprove ? (
                                <Button
                                  w="100%"
                                  loadingText="approving..."
                                  isLoading={isApproving}
                                  onClick={approve}
                                >
                                  {ot('JOIN')}
                                </Button>
                              ) : (
                                <>
                                  {userHoldingOmamories.length > 0 &&
                                  !isSuccessSendAllOmamori ? (
                                    <Button
                                      w="100%"
                                      loadingText="sending..."
                                      isLoading={isSending}
                                      onClick={sendAllOmamori}
                                    >
                                      {ot('SEND_OMAMORI')}
                                    </Button>
                                  ) : (
                                    <Box w="100%">
                                      <Text>「御守り」を送りました！</Text>
                                      <Text>
                                        お焚き上げイベントまで、お待ちください！
                                      </Text>
                                    </Box>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        {IS_EVENT_DAY && isAdmin && (
                          <Button
                            w="100%"
                            loadingText="otakiage..."
                            isLoading={isLoadingOtakiage}
                            onClick={otakiage}
                          >
                            {ot('OTAKIAGE')}
                          </Button>
                        )}
                      </Flex>
                    </>
                  )}
                </>
              )}
              {(isOtakiaged || isSuccessOtakiage) &&
                (IS_RELEASED ||
                  isAdmin ||
                  !(process.env.NODE_ENV === 'production')) && (
                  <Box pb={100}>
                    {IS_EVENT_DAY && (
                      <Text textAlign="center">お焚き上げ！！！！</Text>
                    )}
                    {!IS_EVENT_DAY && address && (
                      <>
                        <Text textAlign="center">{ot('END_OTAKIAGE')}</Text>
                        <Link href={otakiageOmamoriScanUrl} passHref>
                          <a target="_blank" rel="noopener noreferrer">
                            <Text
                              mt={5}
                              textAlign="center"
                              color="teal.500"
                              textDecoration="underline"
                              cursor="pointer"
                            >
                              {otakiageOmamoriScanUrl}
                            </Text>
                          </a>
                        </Link>
                      </>
                    )}
                  </Box>
                )}
            </>
          )}
        </Box>
      )}
      {/* <Divider my={10} borderWidth="2px" /> */}
      {/* {isMounted && filteredNengajo && (
        <Box>
          <Heading size="lg" mb={5}>
            {t('REGISTERD_NENGAJO_LIST')}
          </Heading>
          {<NengajoesList items={filteredNengajo} />}
        </Box>
      )} */}
    </Layout>
  )
}

export default Home
