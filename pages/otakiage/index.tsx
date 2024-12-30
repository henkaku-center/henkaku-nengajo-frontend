import type { NextPage } from 'next'
import {
  Box,
  Flex,
  Heading,
  useToast,
  Image,
  Button,
  Text
} from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { useMounted } from '@/hooks'
import {
  useFetchUserMintedOmamories,
  useFetchUserOmamori,
  useIsApprovedForAllToOtakiage,
  useRetrieveAllOmamori,
  useRetrieveHoldingOmamorisByAddress,
  useSetApprovalForAllOmamoriWithMx
} from '@/hooks/useOmamoriContract'
import Layout from '@/components/Layout'
import useTranslation from 'next-translate/useTranslation'
import OmamoriesList from '@/components/OmamoriesList'
import Orb from '@/components/Naifu/Orb'
import NewlineToBr from '@/utils/NewlineToBr'
import {
  useIsAdmin,
  useIsOtakiaged,
  useOtakiage,
  useSendAllOmamoriWithMx
} from '@/hooks/useOtakiageContract'
import { IS_RELEASED, IS_EVENT_DAY } from '@/constants/Otakiage'
import OtakiageFeature from '@/components/OtakiageFeature'

const OtakiagePage: NextPage = () => {
  const isMounted = useMounted()
  const { t } = useTranslation('common')
  const { t: ot } = useTranslation('otakiage')
  const { isConnected, address } = useAccount()
  const { isAdmin } = useIsAdmin()
  const { userMintedOmamories, userHoldingOmamories, isError } =
    useFetchUserOmamori()
  const { data: isApproved } = useIsApprovedForAllToOtakiage()
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
  const { isOtakiaged } = useIsOtakiaged()

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
      <OtakiageFeature />
    </Layout>
  )
}

export default OtakiagePage
