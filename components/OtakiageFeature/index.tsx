import type { NextPage } from 'next'
import {
  Box,
  Button,
  // Divider,
  Flex,
  Heading,
  Text,
  useToast,
  Image,
  ListItem,
  OrderedList,
  Modal,
  ModalOverlay
} from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { useChainId, useMounted } from '@/hooks'
// import { useRetrieveAllNengajo } from '@/hooks/useNengajoContract'
import Layout from '@/components/Layout'
import { Connect } from '@/components/Connect'
// import NengajoesList from '@/components/NengajoesList'
import StatusMenu from '@/components/StatusMenu'
import useTranslation from 'next-translate/useTranslation'
// import CountDown from '@/components/CountDown'
// import { useCountdown } from '@/hooks/useCountdown'
import {
  useFetchUserOmamori,
  useIsApprovedForAllToOtakiage,
  useSetApprovalForAllOmamoriWithMx
} from '@/hooks/useOmamoriContract'
import {
  useFetchOtakiageOmamories,
  useGetOtakiageOmamoriBalances,
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
import { contractAddresses, holeskyChainId } from '@/utils/contractAddresses'
import OtakiageOmamoriesList from '../OtakiageOmamoriesList'
import { useState } from 'react'

const OtakiageFeature: NextPage = () => {
  const isMounted = useMounted()
  const { chainId } = useChainId()
  const { t } = useTranslation('common')
  const { address } = useAccount()

  const toast = useToast()
  const { userMintedOmamories, userHoldingOmamories } = useFetchUserOmamori()
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
  const { t: ot } = useTranslation('otakiage')
  const { isOtakiaged } = useIsOtakiaged()
  const { data: otakiageOmamoriInfo } = useFetchOtakiageOmamories()

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
  }#readContract#F9`

  const hasMintedOmamori = userMintedOmamories && userMintedOmamories.length > 0
  const [isShowMovie, setShowMovie] = useState(false)

  return (
    <>
      {isMounted && (
        <Box>
          <Flex direction="column" alignItems="center" mt={10}>
            <Heading
              className="text_serif"
              size="2xl"
              mb={10}
              textAlign="center"
              width="100%"
            >
              HENKAKU
              <br />
              {ot('OTAKIAGE')}
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
          <>
            {!isOtakiaged && (
              <>
                {(IS_RELEASED ||
                  isAdmin ||
                  !(process.env.NODE_ENV === 'production')) && (
                  <>
                    <Heading className="text_serif" size="xl" mt={10} pb={5}>
                      {ot('PREPARE_FOR_OTAKIAGE')}
                    </Heading>
                    <Text className="text_serif">
                      {ot('PREPARE_FOR_OTAKIAGE_EXPLANATION')}
                    </Text>
                    <Box>
                      <Heading className="text_serif" size="l" mt={10} pb={5}>
                        {ot('HOWTO_OTAKIAGE')}
                      </Heading>
                      <OrderedList>
                        <ListItem>
                          <Text className="text_serif">
                            {ot('HOWTO_OTAKIAGE_EXPLANATION_1')}
                          </Text>
                          <Box textAlign="center" mb={10}>
                            <Box mt="2em" display="inline-block">
                              <Flex
                                gap={6}
                                justifyContent="center"
                                textAlign="left"
                              >
                                <Connect />
                                <StatusMenu />
                              </Flex>
                            </Box>
                          </Box>
                        </ListItem>
                        {address && (
                          <ListItem>
                            <>
                              <Text className="text_serif">
                                {ot('HOWTO_OTAKIAGE_EXPLANATION_2')}
                              </Text>
                              <Heading
                                className="text_serif"
                                size="l"
                                mt={5}
                                pb={10}
                              >
                                {ot('USER_OMAMORI_LIST')}
                              </Heading>

                              {hasMintedOmamori ? (
                                <Box mt={0} pb={10}>
                                  <OmamoriesList items={userMintedOmamories} />
                                </Box>
                              ) : (
                                <Box mt={0} pb={10}>
                                  <Text className="text_serif">
                                    {ot('NO_OMAMORI')}
                                  </Text>
                                </Box>
                              )}
                              <Flex
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                py={10}
                                maxWidth="240px"
                                margin="0 auto"
                                gap={10}
                              >
                                <>
                                  {!isApproved && !isSuccessApprove ? (
                                    <Button
                                      w="100%"
                                      loadingText="approving..."
                                      isLoading={isApproving}
                                      onClick={approve}
                                      isDisabled={!hasMintedOmamori}
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
                                          <Text>
                                            {ot('SUCCESS_SEND_OMAMORI')}
                                          </Text>
                                        </Box>
                                      )}
                                    </>
                                  )}
                                </>
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
                              <Text
                                className="text_serif"
                                fontSize="small"
                                mb={10}
                              >
                                {ot('OTAKIAGE_EXPLANATION')}（
                                <Link href="https://imaichiyyy.notion.site/HENKAKU-165910a5a4d080e292d2f813c8758a4a?pvs=4">
                                  <a target="_blank" rel="noopener noreferrer">
                                    <Text
                                      color="teal.500"
                                      textDecoration="underline"
                                      cursor="pointer"
                                      display="inline"
                                    >
                                      {ot('OTAKIAGE_MANUAL')}
                                    </Text>
                                  </a>
                                </Link>
                                ）
                              </Text>
                            </>
                          </ListItem>
                        )}
                      </OrderedList>
                    </Box>
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
                    <>
                      {isShowMovie && (
                        <>
                          <Modal
                            isOpen={isShowMovie}
                            onClose={() => setShowMovie(false)}
                            scrollBehavior="inside"
                            size="xl"
                          >
                            <Box position={'relative'}>
                              <ModalOverlay onClick={() => setShowMovie(false)}>
                                <Box
                                  display={'flex'}
                                  position={'absolute'}
                                  zIndex={10000}
                                  top={'5vh'}
                                  left={'5vw'}
                                >
                                  <iframe
                                    src="https://www.youtube.com/embed/nFhBLMGyIe8?si=armzc4Pg0v2KfTmk&autoplay=1"
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                    style={{
                                      width: '90vw',
                                      height: '90vh'
                                    }}
                                  ></iframe>
                                </Box>
                              </ModalOverlay>
                            </Box>
                          </Modal>
                        </>
                      )}
                      <Box>
                        <Button onClick={() => setShowMovie(true)}>
                          お焚上後の動画再生
                        </Button>
                      </Box>
                    </>
                  )}
                  <Heading className="text_serif" size="l" mt={5} pb={10}>
                    {ot('OTAKIAGE_OMAMORI_LIST')}
                  </Heading>
                  {address && otakiageOmamoriInfo ? (
                    <OtakiageOmamoriesList items={otakiageOmamoriInfo} />
                  ) : (
                    <Box mt={0} pb={10}>
                      <Text className="text_serif">{ot('NO_OMAMORI')}</Text>
                    </Box>
                  )}
                  {!IS_EVENT_DAY && address && (
                    <Box pt={10}>
                      <Text
                        className="text_serif"
                        textAlign="center"
                        fontWeight="bold"
                        display="block"
                      >
                        {ot('END_OTAKIAGE')}
                      </Text>
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
                    </Box>
                  )}
                </Box>
              )}
          </>
        </Box>
      )}
    </>
  )
}

export default OtakiageFeature
