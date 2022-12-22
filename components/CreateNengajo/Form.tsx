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
  FormErrorMessage
} from '@chakra-ui/react'
import { useUploadImageFile, useUploadMetadataJson } from '@/hooks/usePinata'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

type FormData = {
  name: string
  description: string
  image: File | null
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
const metadata_contributors = 'futa; imaichiyyy; karawapo ....'

const CreateNengajoForm: FC = () => {
  const { t, lang } = useTranslation('common')
  const { address } = useAccount()
  const router = useRouter()

  const { control, handleSubmit, formState, watch } = useForm<FormData>({
    defaultValues: {
      name: '',
      description:
        lang === 'en'
          ? 'This is a Nengajo NFT sent with HENKAKU NENGAJO.'
          : 'HENKAKU NENGAJO から送られた年賀状NFTです。',
      image: null,
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
  } = useRegisterNengajo(watch('maxSupply'), metadataURI)
  const uploadFile = useUploadImageFile()
  const uploadMetadata = useUploadMetadataJson()

  useEffect(() => {
    if (isSuccess && registeredTokenId) {
      router.push(`/nengajo/${registeredTokenId}`)
    }
  }, [registeredTokenId, isSuccess])

  const submit = async (data: FormData, e: any) => {
    if (!data.image) return
    const imageIPFSHash = await uploadFile(data.image)
    const medatadaJson: NengajoTokenMetadata = {
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
    const metadataIPFSHash = await uploadMetadata(medatadaJson)
    setMetadataURI(`ipfs://${metadataIPFSHash}`)
    await txWithContract(data.maxSupply, `ipfs://${metadataIPFSHash}`)
    return
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

  return (
    <Box color="white.700">
      <Heading as="h2" color="white.600">
        {t('CREATE_NEW_NENGAJO')}
      </Heading>
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

        <FormControl mt={5}>
          <FormLabel mt="1em" htmlFor="imageFile">
            {t('NEW_NENGAJO_PICTURE_LABEL')}
          </FormLabel>
          <Controller
            control={control}
            name="image"
            rules={{ required: t('REQUIRED_INPUT') }}
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
            rules={{ required: t('REQUIRED_INPUT') }}
            render={({ field: { onChange, value }, fieldState }) => (
              <>
                <Input
                  variant="outline"
                  id="maxSupply"
                  type="text"
                  placeholder={t('NEW_NENGAJO_MAX_SUPPLY')}
                  onChange={onChange}
                  value={value}
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
      </form>
    </Box>
  )
}

export default CreateNengajoForm
