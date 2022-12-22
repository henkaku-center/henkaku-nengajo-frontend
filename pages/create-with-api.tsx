import { useEffect, useMemo, useState } from 'react'
import type { NextPage } from 'next'
import {
  Box,
  Heading,
  Link,
  Button,
  Image,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react'
import { useMounted } from '@/hooks'
import { Connect } from '@/components/Connect'
import Layout from '@/components/Layout'
import { useAccount } from 'wagmi'
import useTranslation from 'next-translate/useTranslation'
import { useRegisterNengajo } from '@/hooks/useNengajoContract'
import { useUploadImageFile } from '@/hooks/usePinata'

const metadata_description = 'A Nengajo sent using HENKAKU Nengajo.'
const metadata_external_url = 'https://henkaku-nengajo.vercel.app'

interface NengajoTokenMetadata {
  name: string
  image: string
  description?: string | null | undefined
  animation_url?: string | null | undefined
  external_url?: string | null | undefined
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

const Home: NextPage = () => {
  const isMounted = useMounted()
  const { t } = useTranslation('common')
  const { isConnected, address } = useAccount()
  const [metadataName, setMetadataName] = useState('')
  const [isUploadingIPFS, setIsUploadingIPFS] = useState(false)
  const [fileImg, setFileImg] = useState<File | null>()
  const uploadFileAndPin = useUploadImageFile()
  const [imageUri, setImageUri] = useState('')
  const {
    isLoading: txIsLoading,
    isSuccess,
    writeAsync,
    registeredTokenId
  } = useRegisterNengajo()
  const [metadataUri, setMetadataUri] = useState('')
  useEffect(() => {
    if (isSuccess && registeredTokenId) {
      alert(`your registered tokenId is ${registeredTokenId}`)
    }
  }, [registeredTokenId, isSuccess])

  const isLoading = useMemo(() => {
    return txIsLoading || isUploadingIPFS ? true : false
  }, [txIsLoading, isUploadingIPFS])

  const handleImageChange = async (e: any) => {
    setFileImg(e?.target?.files[0])
  }
  const handleNameChange = async (e: any) => {
    setMetadataName(e.target.value)
  }
  const handleSubmit = async (e: any) => {
    if (e.preventDefault) e.preventDefault()
    const imageUriPath = await sendFileToIPFS()
    if (!imageUriPath) return
    const metadataUriPath = await putMetadataOnIPFS(imageUriPath)
    if (!metadataUriPath) return
    await txWithContract(3, metadataUriPath)
  }

  const sendFileToIPFS = async () => {
    if (fileImg === undefined || fileImg === null) return false
    if (metadataName === '') return false
    setIsUploadingIPFS(true)
    try {
      const ipfsHash = await uploadFileAndPin(fileImg)
      const imageUriPath = `ipfs://ipfsHash`
      setImageUri(imageUriPath)
      return imageUriPath
    } catch (error) {
      setIsUploadingIPFS(false)
      console.error('Error sending File to IPFS: ')
      console.error(error)
    }
  }

  const putMetadataOnIPFS = async (imageUriPath: string) => {
    if (metadataUri !== '') return
    if (address === undefined) return
    if (metadataName === '') return
    setIsUploadingIPFS(true)

    const metadata: NengajoTokenMetadata = {
      name: metadataName,
      description: metadata_description,
      image: imageUriPath,
      external_url: metadata_external_url,
      attributes: [
        {
          trait_type: 'Author',
          value: address,
          display_type: null,
          max_value: null,
          trait_count: 0,
          order: null
        }
      ]
    }

    console.log('Putting metadata on IPFS', metadata)

    try {
      const pinataRequest = await fetch('/api/pin-json-to-ipfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata)
      })
      var res = await pinataRequest.json()
      setMetadataUri(gateway_url + res.IpfsHash)
      console.log('Metadata IPFS URI:', gateway_url + res.IpfsHash)
      return gateway_url + res.IpfsHash
    } catch (error) {
      setIsUploadingIPFS(false)
      console.error('Error sending metadata to IPFS: ')
      console.error(error)
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

  return (
    <Layout>
      <Heading as="h1" size="4xl">
        {t('HENKAKU')} <span className="text_nengajo">{t('NENGAJO')}</span>
      </Heading>
      {isMounted && (
        <Box mt="2em">
          <Connect />
        </Box>
      )}
      {isMounted && isConnected && (
        <Box mt="2em" color="white.700">
          <Heading as="h2" color="white.600">
            {t('CREATE_NEW_NENGAJO')}
          </Heading>
          {metadataUri !== '' ? (
            <Box mt="1em">
              {t('UPLOAD_SUCCESS')} (
              <Link href={metadataUri}>Metadata JSON</Link>)
              <Image
                mt="1em"
                src={imageUri ?? ''}
                alt={t('IMAGE_PREVIEW_ALT') + ': ' + imageUri}
              ></Image>
            </Box>
          ) : (
            <FormControl isRequired mt={5}>
              <form onSubmit={handleSubmit}>
                <FormLabel mt="1em" htmlFor="nengajoName">
                  {t('NEW_NENGAJO_TITLE_LABEL')}
                </FormLabel>
                <Input
                  variant="outline"
                  id="nengajoName"
                  type="text"
                  isRequired={true}
                  placeholder={t('NEW_NENGAJO_TITLE_LABEL')}
                  name="nengajoName"
                  onChange={handleNameChange}
                />
                <FormLabel mt="1em" htmlFor="imageFile">
                  {t('NEW_NENGAJO_PICTURE_LABEL')}
                </FormLabel>
                <Input
                  variant="outline"
                  id="imageFile"
                  type="file"
                  accept={'image/*'}
                  isRequired={true}
                  name="profilePicture"
                  onChange={handleImageChange}
                />
                <Button
                  mt={10}
                  colorScheme="green"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                >
                  {t('BUTTON_CREATE')}
                </Button>
              </form>
            </FormControl>
          )}
        </Box>
      )}
    </Layout>
  )
}

export default Home
