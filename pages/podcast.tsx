import { Connect } from '@/components'
import CountDown from '@/components/CountDown'
import GlobalIcon from '@/components/Icon/Global'
import Layout from '@/components/Layout'
import { useChainId, useMounted } from '@/hooks'
import { useCountdown } from '@/hooks/useCountdown'
import {
  useCurrentSupply,
  useIsHoldingByTokenId,
  useMintNengajoWithMx
} from '@/hooks/useNengajoContractPodcast'
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
import setLanguage from 'next-translate/setLanguage'
import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import { FC, useMemo } from 'react'
import { useAccount, useSwitchNetwork } from 'wagmi'

const CountDownElm: FC = () => {
  const { t, lang } = useTranslation('common')
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
        <span className="text_nengajo">{t('NENGAJO')}</span>
        <Button
          ml={2}
          size="md"
          onClick={async () => await setLanguage(lang == 'en' ? 'ja' : 'en')}
        >
          <GlobalIcon />
        </Button>
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
  const {
    sendMetaTx,
    isLoading: isLoadingTx,
    isSuccess
  } = useMintNengajoWithMx()
  const { data: currentSupply, isLoading: isLoadingCurrentSupply } =
    useCurrentSupply()
  const { isHolding, isLoading: isLoadingHold } = useIsHoldingByTokenId(1)
  const { wrongNetwork } = useChainId()
  const { switchNetworkAsync, status: switchNetworkStatus } = useSwitchNetwork({
    chainId: 80001
  })
  const toast = useToast()

  const submit = async () => {
    try {
      await sendMetaTx()
    } catch (error: any) {
      toast({
        id: 'MINT_NENGAJO_MTX_FAILED',
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

  const ButtonElm: FC = () => {
    if (isConnected && wrongNetwork && switchNetworkAsync) {
      return (
        <Button
          size="lg"
          colorScheme="teal"
          borderRadius="full"
          onClick={() => switchNetworkAsync(80001)}
          isLoading={switchNetworkStatus === 'loading'}
        >
          Change Network
        </Button>
      )
    } else if (isConnected) {
      return (
        <Button
          size="lg"
          colorScheme="teal"
          borderRadius="full"
          onClick={submit}
          isLoading={isLoadingTx}
        >
          Mint Nengajo NFT
        </Button>
      )
    } else {
      return <Connect />
    }
  }

  return (
    <Layout disableHeader>
      <CountDownElm />

      <Grid gridTemplateColumns={{ md: '1fr 1fr' }} my={8} columnGap={5}>
        <Box filter={showNFTImage ? 'none' : 'blur(10px)'}>
          <Image width="400px" height="400px" src="/podcast-nengajo.jpg" />
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
                受け取っていただいてありがとうございます。
                <br />
                来年もどうぞよろしくおねがいします。
              </Text>
            ) : (
              <ButtonElm />
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
