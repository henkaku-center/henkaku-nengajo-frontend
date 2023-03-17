import { Connect } from '@/components'
import CountDown from '@/components/CountDown'
import Layout from '@/components/Layout'
import { useChainId, useMounted } from '@/hooks'
import { useCountdown } from '@/hooks/useCountdown'
import {
  useCurrentSupply,
  useIsHoldingByTokenId,
  useMintTicketWithMx
} from '@/hooks/useTicketContractPodcast'
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
  useToast
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { FC, useMemo } from 'react'
import { useAccount, useSwitchNetwork } from 'wagmi'

const CountDownElm: FC = () => {
  const { t } = useTranslation('common')
  const { isStart, ...countDown } = useCountdown()
  return (
    <Box textAlign="center">
      <Heading
        size="lg"
        mb={10}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box as="span" mr={2}>
          {t('HENKAKU')}
        </Box>
        <span className="text_ticket">{t('TICKET')}</span>
      </Heading>

      <Text fontSize="24px" fontWeight="bold" lineHeight={2}>
        {isStart ? (
          <>
            {t('TOP_MINT_START_AKEOME')}
            <br />
            {t('TOP_MINT_START_READY')}
          </>
        ) : (
          <>{t('TOP_UNTIL_START')}</>
        )}
      </Text>
      {!isStart && <CountDown data={countDown} />}
    </Box>
  )
}

const Entity = () => {
  const { isConnected, address } = useAccount()
  const { isStart } = useCountdown()
  const { t, lang } = useTranslation('common')
  const {
    sendMetaTx,
    isLoading: isLoadingTx,
    isSuccess
  } = useMintTicketWithMx()
  const { data: currentSupply, isLoading: isLoadingCurrentSupply } =
    useCurrentSupply()
  const { isHolding, isLoading: isLoadingHold } = useIsHoldingByTokenId(1)
  const { wrongNetwork, chainId } = useChainId()
  const { switchNetworkAsync, status: switchNetworkStatus } = useSwitchNetwork({
    chainId
  })
  const toast = useToast()

  const submit = async () => {
    try {
      await sendMetaTx()
      return
    } catch (error: any) {
      toast({
        id: 'MINT_TICKET_MTX_FAILED',
        title: error?.message,
        status: 'error',
        duration: 5000,
        position: 'top'
      })
    }
  }

  const showNFTImage = useMemo(() => {
    if (isHolding || currentSupply?.toNumber() === 100 || isSuccess) {
      return true
    } else {
      return false
    }
  }, [isHolding, currentSupply, isSuccess])

  const ButtonElm = useMemo(() => {
    if (isConnected && wrongNetwork && switchNetworkAsync) {
      return (
        <Button
          size="lg"
          colorScheme="teal"
          borderRadius="full"
          onClick={() => switchNetworkAsync(chainId)}
          isLoading={switchNetworkStatus === 'loading'}
        >
          Change Network
        </Button>
      )
    } else if (isConnected && isStart) {
      return (
        <>
          <Button
            size="lg"
            colorScheme="teal"
            borderRadius="full"
            onClick={submit}
            isLoading={isLoadingTx || isLoadingHold}
            disabled={isLoadingTx || isLoadingHold}
          >
            {t('GET_TICKET')}
          </Button>
          <Text fontSize="12px" fontWeight="bold" mt={2}>
            {t('WITHOUT_GAS_FEE')}
          </Text>
        </>
      )
    } else {
      return <Connect />
    }
  }, [isStart, isConnected, wrongNetwork, switchNetworkAsync, lang])

  return (
    <Layout isExternal>
      <CountDownElm />

      <Grid gridTemplateColumns={{ md: '1fr 1fr' }} my={8} columnGap={5}>
        <Box filter={showNFTImage ? 'none' : 'blur(10px)'}>
          <Image
            width="400px"
            height="400px"
            src="/podcast-nengajo.gif"
            alt=""
          />
        </Box>

        <Flex justifyContent="center" alignItems="center" textAlign="center">
          <Box>
            <Text fontSize="18px" fontWeight="bold">
              {isLoadingCurrentSupply ? (
                <Spinner />
              ) : (
                `${currentSupply?.toNumber()} / 100`
              )}
            </Text>
            <Text fontSize="18px" fontWeight="bold" mb={10}>
              Wallet Address: {address?.substring(0, 10)}...
            </Text>

            {showNFTImage ? (
              <Text>
                {t('THANK_YOU_FOR_MINT')}
                <br />
                {t('GREET_THIS_YEAR')}
              </Text>
            ) : (
              ButtonElm
            )}
          </Box>
        </Flex>
      </Grid>
    </Layout>
  )
}

const PodcastMintPage: FC = () => {
  const isMounted = useMounted()

  return isMounted ? <Entity /> : <></>
}

export default PodcastMintPage
