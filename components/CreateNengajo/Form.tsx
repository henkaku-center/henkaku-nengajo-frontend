import { useRegisterNengajo } from '@/hooks/useNengajoContract'
import useTranslation from 'next-translate/useTranslation'
import { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Box,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Flex
} from '@chakra-ui/react'
import { useUploadImageFile, useUploadMetadataJson } from '@/hooks/usePinata'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { useLitEncryption } from '@/hooks/useLitProtocol'
import CheckHenkaku from './CheckHenkaku'

type FormData = {
  name: string
  description: string
  image: File | null
  secretMessage: File | null
  creatorName: string
  maxSupply: number
}

interface NengajoTokenMetadata {
  name: string
  image: string
  description?: string | null | undefined
  animation_url?: string | null | undefined
  external_url?: string | null | undefined
  contributors: string
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

const metadata_external_url = 'https://nengajo.henkaku.org'
const metadata_contributors =
  'daishin;FLOTAN;futa;geeknees;imaichiyyy;mindinc;karawapo;RYU;sushi yam;yawn;Yuki aka Ryoma;Yuudai;'

const CreateNengajoForm: FC = () => {
  const { t, lang } = useTranslation('common')
  const { address } = useAccount()
  const router = useRouter()
  const { initEncrypt, updateEncrypt, encryptedSymmetricKey } =
    useLitEncryption()

  const { control, handleSubmit, formState, watch } = useForm<FormData>({
    defaultValues: {
      name: '',
      description:
        lang === 'en'
          ? 'This is a Nengajo NFT sent with HENKAKU NENGAJO.'
          : 'HENKAKU NENGAJO から送られた年賀状NFTです。',
      image: null,
      secretMessage: null,
      creatorName: '',
      maxSupply: 10
    }
  })
  const [metadataURI, setMetadataURI] = useState('')

  const {
    isLoading: txIsLoading,
    isSuccess,
    writeAsync,
    registeredTokenId
  } = useRegisterNengajo(Number(watch('maxSupply')), metadataURI)
  const uploadFile = useUploadImageFile()
  const uploadMetadata = useUploadMetadataJson()

  useEffect(() => {
    const callback = async () => {
      if (isSuccess && registeredTokenId) {
        if (encryptedSymmetricKey) {
          await updateEncrypt(registeredTokenId, encryptedSymmetricKey)
        }
        router.push(`/nengajo/${registeredTokenId}`)
      }
    }
    callback()
  }, [registeredTokenId, isSuccess])

  const submit = async (data: FormData) => {
    try {
      if (!data.image) return
      const imageIPFSHash = await uploadFile(data.image)
      const metadataJson: NengajoTokenMetadata = {
        name: data.name,
        image: `ipfs://${imageIPFSHash}`,
        description: data.description,
        external_url: metadata_external_url,
        contributors: metadata_contributors,
        attributes: [
          {
            trait_type: 'CreatorAddress',
            value: address!
          },
          {
            trait_type: 'CreatorName',
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
      await txWithContract(data.maxSupply, `ipfs://${metadataIPFSHash}`)
      return
    } catch (error) {
      console.log(error)
    }
  }

  const txWithContract = async (maxSupply: number, metaDataURL: string) => {
    try {
      if (!writeAsync) return
      await writeAsync({
        recklesslySetUnpreparedArgs: [maxSupply, metaDataURL]
      })
      return
    } catch (error) {
      console.log(error)
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
          <FormLabel mt="1em" htmlFor="nengajoName">
            {t('NEW_NENGAJO_TITLE_LABEL')}
          </FormLabel>
          <Controller
            control={control}
            name="name"
            rules={{ required: t('REQUIRED_INPUT') }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <Input
                  variant="outline"
                  id="nengajoName"
                  type="text"
                  isRequired={true}
                  placeholder={t('NEW_NENGAJO_TITLE_LABEL')}
                  onChange={onChange}
                />
                <Box color="red.300">{fieldState.error?.message}</Box>
              </>
            )}
          />
        </FormControl>

        <FormControl mt={5} isRequired>
          <FormLabel mt="1em" htmlFor="imageFile">
            {t('NEW_NENGAJO_PICTURE_LABEL')}
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
            {t('NEW_NENGAJO_SECRET_MESSAGE_LABEL')}
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
          <FormLabel mt="1em" htmlFor="nengajoName">
            {t('NEW_NENGAJO_DESCRIPTION')}
          </FormLabel>
          <Controller
            control={control}
            name="description"
            rules={{ required: t('REQUIRED_INPUT') }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <Input
                  variant="outline"
                  id="nengajoName"
                  type="text"
                  isRequired={true}
                  placeholder={t('NEW_NENGAJO_DESCRIPTION')}
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
            {t('NEW_NENGAJO_CREATOR_NAME')}
          </FormLabel>
          <Controller
            control={control}
            name="creatorName"
            render={({ field: { onChange, value } }) => (
              <Input
                variant="outline"
                id="creatorName"
                type="text"
                placeholder={t('NEW_NENGAJO_CREATOR_NAME')}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mt="1em" htmlFor="maxSupply">
            {t('NEW_NENGAJO_MAX_SUPPLY')}
          </FormLabel>
          <Controller
            control={control}
            name="maxSupply"
            rules={{ required: t('REQUIRED_INPUT'), min: 1 }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <Flex gap={4} alignItems="center">
                  <Input
                    variant="outline"
                    id="maxSupply"
                    type="number"
                    placeholder={t('NEW_NENGAJO_MAX_SUPPLY')}
                    onChange={onChange}
                    value={value}
                  />
                  <CheckHenkaku maxSupply={watch('maxSupply')} />
                </Flex>
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
          {t('NEW_NENGAJO_TAKING_TIME')}
        </Text>
      </form>
    </Box>
  )
}

export default CreateNengajoForm
