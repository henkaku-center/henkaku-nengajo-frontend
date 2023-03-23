import { useRegisterTicket } from '@/hooks/useTicketContract'
import useTranslation from 'next-translate/useTranslation'
import { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast
} from '@chakra-ui/react'
import { RangeDatepicker } from 'chakra-dayzed-datepicker'
import { useUploadImageFile, useUploadMetadataJson } from '@/hooks/usePinata'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { useLitEncryption } from '@/hooks/useLitProtocol'
import { BigNumber, ethers } from 'ethers'

type FormData = {
  name: string
  description: string
  image: File | null
  secretMessage: File | null
  poolWalletAddress: string
  creatorName: string
  maxSupply: number
  price: number
  blockTimeStamp: Date[]
}

interface TicketTokenMetadata {
  name: string
  image: string
  description?: string | null | undefined
  animation_url?: string | null | undefined
  external_url?: string | null | undefined
  encryptedFile?: string
  encryptedSymmetricKey?: string
  attributes: TokenAttribute[]
}

interface TokenAttribute {
  trait_type: string
  value: number | string
  display_type?: string | null | undefined
  max_value?: number | null | undefined
  trait_count?: number | null | undefined
  order?: number | null | undefined
}

const metadata_external_url = 'https://ticket.henkaku.org'

const CreateTicketForm: FC = () => {
  const { t } = useTranslation('common')
  const { address } = useAccount()
  const router = useRouter()
  const toast = useToast()
  const { initEncrypt, updateEncrypt, encryptedSymmetricKey } =
    useLitEncryption()

  const { control, handleSubmit, formState, watch } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      image: null,
      secretMessage: null,
      poolWalletAddress: '',
      creatorName: '',
      maxSupply: 10,
      price: 10,
      blockTimeStamp: [new Date(), new Date()]
    }
  })
  const [metadataURI, setMetadataURI] = useState('')

  const {
    isLoading: txIsLoading,
    isSuccess,
    writeAsync,
    registeredTokenId
  } = useRegisterTicket(
    Number(watch('maxSupply')),
    metadataURI,
    Number(watch('price')),
    watch('blockTimeStamp')
  )
  const uploadFile = useUploadImageFile()
  const uploadMetadata = useUploadMetadataJson()

  useEffect(() => {
    const callback = async () => {
      if (isSuccess && registeredTokenId) {
        if (encryptedSymmetricKey) {
          await updateEncrypt(registeredTokenId, encryptedSymmetricKey)
        }
        router.push(`/ticket/${registeredTokenId}`)
      }
    }
    callback()
  }, [registeredTokenId, isSuccess])

  const submit = async (data: FormData) => {
    try {
      if (!data.image) return
      const imageIPFSHash = await uploadFile(data.image)
      const metadataJson: TicketTokenMetadata = {
        name: data.name,
        image: `ipfs://${imageIPFSHash}`,
        description: data.description,
        external_url: metadata_external_url,
        attributes: [
          {
            trait_type: 'OrganizerAddress',
            value: address!
          },
          {
            trait_type: 'OrganizerName',
            value: data.creatorName
          }
        ]
      }

      if (data.secretMessage) {
        const encryptedInfo = await initEncrypt(data.secretMessage)
        metadataJson.encryptedFile = encryptedInfo?.stringifiedEncryptedFile
        metadataJson.encryptedSymmetricKey =
          encryptedInfo?.encryptedSymmetricKey
      }

      const metadataIPFSHash = await uploadMetadata(metadataJson)
      setMetadataURI(`ipfs://${metadataIPFSHash}`)
      await txWithContract(
        data.maxSupply,
        `ipfs://${metadataIPFSHash}`,
        ethers.utils.parseEther(String(data.price)),
        data.blockTimeStamp,
        data.poolWalletAddress
      )
      return
    } catch (error) {
      console.log(error)
    }
  }

  const txWithContract = async (
    maxSupply: number,
    metaDataURL: string,
    price: BigNumber,
    blockTimeStamp: Date[],
    poolWalletAddress: string
  ) => {
    try {
      if (!writeAsync) return
      const open_blockTimeStamp = Math.floor(
        (blockTimeStamp[0]?.getTime() || Date.now()) / 1000
      )
      const close_clockTimeStamp = Math.floor(
        (blockTimeStamp[1]?.getTime() || Date.now()) / 1000
      )

      await writeAsync({
        recklesslySetUnpreparedArgs: [
          maxSupply,
          metaDataURL,
          price,
          open_blockTimeStamp,
          close_clockTimeStamp,
          poolWalletAddress
        ]
      })
      return
    } catch (error: any) {
      toast({
        id: 'REGISTER_FAILED',
        title: error?.message,
        status: 'error',
        duration: 5000,
        position: 'top'
      })
    }
  }

  const validateFileSize = (file: File | null, limit: number) => {
    if (!file) return true
    return file.size / (1024 * 1024) > limit ? `Upto ${limit}MB` : true
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(submit)}>
        <FormControl mt={5} isRequired>
          <FormLabel mt="1em" htmlFor="ticketName">
            {t('NEW_TICKET_TITLE_LABEL')}
          </FormLabel>
          <Controller
            control={control}
            name="name"
            rules={{ required: t('REQUIRED_INPUT') }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <Input
                  variant="outline"
                  id="ticketName"
                  type="text"
                  isRequired={true}
                  placeholder={t('NEW_TICKET_TITLE_LABEL')}
                  onChange={onChange}
                />
                <Box color="red.300">{fieldState.error?.message}</Box>
              </>
            )}
          />
        </FormControl>

        <FormControl mt={5} isRequired>
          <FormLabel mt="1em" htmlFor="imageFile">
            {t('NEW_TICKET_PICTURE_LABEL')}
          </FormLabel>
          <Controller
            control={control}
            name="image"
            rules={{
              required: t('REQUIRED_INPUT'),
              validate: (v) => validateFileSize(v, 3)
            }}
            render={({ field: { onChange }, fieldState }) => (
              <>
                <Input
                  variant="unstyled"
                  p={1}
                  id="imageFile"
                  type="file"
                  accept={'image/*'}
                  isRequired={true}
                  onChange={(e) =>
                    e.target.files && e.target.files[0].size
                      ? onChange(e.target.files[0])
                      : false
                  }
                />
                <Box color="red.300">{fieldState.error?.message}</Box>
              </>
            )}
          />
        </FormControl>

        <FormControl mt={5}>
          <FormLabel mt="1em" htmlFor="secretMessage">
            {t('NEW_TICKET_SECRET_MESSAGE_LABEL')}
          </FormLabel>
          <Controller
            control={control}
            name="secretMessage"
            rules={{
              validate: (v) => validateFileSize(v, 0.5)
            }}
            render={({ field: { onChange }, fieldState }) => (
              <>
                <Input
                  variant="unstyled"
                  p={1}
                  id="secretMessage"
                  type="file"
                  accept={'image/*'}
                  onChange={(e) =>
                    e.target.files ? onChange(e.target.files[0]) : false
                  }
                />
                <Box color="red.300">{fieldState.error?.message}</Box>
              </>
            )}
          />
        </FormControl>

        <FormControl mt={5} isRequired>
          <FormLabel mt="1em" htmlFor="ticketName">
            {t('NEW_TICKET_DESCRIPTION')}
          </FormLabel>
          <Controller
            control={control}
            name="description"
            rules={{ required: t('REQUIRED_INPUT') }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <Input
                  variant="outline"
                  id="ticketName"
                  type="text"
                  isRequired={true}
                  placeholder={t('NEW_TICKET_DESCRIPTION')}
                  onChange={onChange}
                  value={value}
                />
                <Box color="red.300">{fieldState.error?.message}</Box>
              </>
            )}
          />
        </FormControl>

        <FormControl>
          <FormLabel mt="1em" htmlFor="creatorName">
            {t('NEW_TICKET_CREATOR_NAME')}
          </FormLabel>
          <Controller
            control={control}
            name="creatorName"
            render={({ field: { onChange, value } }) => (
              <Input
                variant="outline"
                id="creatorName"
                type="text"
                placeholder={t('NEW_TICKET_CREATOR_NAME')}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mt="1em" htmlFor="maxSupply">
            {t('NEW_TICKET_MAX_SUPPLY')}
          </FormLabel>
          <Controller
            control={control}
            name="maxSupply"
            rules={{ required: t('REQUIRED_INPUT'), min: 1 }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <Input
                  variant="outline"
                  id="maxSupply"
                  type="number"
                  placeholder={t('NEW_TICKET_MAX_SUPPLY')}
                  onChange={onChange}
                  value={value}
                />
                <Box color="red.300">{fieldState.error?.message}</Box>
              </>
            )}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mt="1em" htmlFor="price">
            {t('NEW_TICKET_PRICE')}
          </FormLabel>
          <Controller
            control={control}
            name="price"
            rules={{ required: t('REQUIRED_INPUT'), min: 1 }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <Input
                  variant="outline"
                  id="price"
                  type="number"
                  placeholder={t('NEW_TICKET_PRICE')}
                  onChange={onChange}
                  value={value}
                />
                <Box color="red.300">{fieldState.error?.message}</Box>
              </>
            )}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mt="1em" htmlFor="poolWalletAddress">
            {t('NEW_TICKET_POOL_WALLET')}
          </FormLabel>
          <Controller
            control={control}
            name="poolWalletAddress"
            rules={{ required: t('REQUIRED_INPUT'), min: 1 }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <Input
                  variant="outline"
                  id="poolWalletAddress"
                  type="text"
                  placeholder={t('NEW_TICKET_POOL_WALLET')}
                  onChange={onChange}
                  value={value}
                />
                <Box color="red.300">{fieldState.error?.message}</Box>
              </>
            )}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mt="1em" htmlFor="blockTimeStamp">
            {t('NEW_TICKET_TIMESTAMP')}
          </FormLabel>
          <Controller
            control={control}
            name="blockTimeStamp"
            rules={{ required: t('REQUIRED_INPUT'), min: 1 }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <RangeDatepicker
                  id="blockTimeStamp"
                  selectedDates={value}
                  onDateChange={onChange}
                  configs={{
                    dateFormat: 'yyyy/MM/dd',
                    dayNames: '日月火水木金土'.split(''), // length of 7
                    monthNames:
                      '1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月'.split(
                        ','
                      ) // length of 12
                  }}
                />
                <Box color="red.300">{fieldState.error?.message}</Box>
              </>
            )}
          />
        </FormControl>

        <Button
          mt={10}
          colorScheme="teal"
          isLoading={
            formState.isSubmitting || (isSuccess && !registeredTokenId)
          }
          width="full"
          type="submit"
        >
          {t('BUTTON_CREATE')}
        </Button>

        <Text color="red.400" textAlign="right" mt={1}>
          {t('NEW_TICKET_TAKING_TIME')}
        </Text>
      </form>
    </Box>
  )
}

export default CreateTicketForm
