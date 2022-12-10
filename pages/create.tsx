import { useState, useEffect } from 'react'
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
import axios from 'axios'
import useTranslation from 'next-translate/useTranslation'

const IPFS_API_KEY = process.env.NEXT_PUBLIC_IPFS_API_KEY
const IPFS_API_SECRET = process.env.NEXT_PUBLIC_IPFS_API_SECRET
const IPFS_API_ENDPOINT = process.env.NEXT_PUBLIC_IPFS_API_ENDPOINT

const Home: NextPage = () => {
  const isMounted = useMounted()
  const { t } = useTranslation('common')
  const { isConnected, address } = useAccount()
  const [metadataName, setMetadataName] = useState('Test') // TODO: replace with form input
  const [fileImg, setFileImg] = useState<File | null>()
  const [isLoading, setIsLoading] = useState(false)
  const [imageUri, setImageUri] = useState('')
  const [metadataUri, setMetadataUri] = useState('')

  const handleImageChange = async (e: any) => {
    setFileImg(e?.target?.files[0])
  }
  const sendFileToIPFS = async (e: any) => {
    if (fileImg === undefined || fileImg === null) return
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', fileImg)
      const resFile = await axios({
        method: 'post',
        url: IPFS_API_ENDPOINT + '/pinning/pinFileToIPFS',
        data: formData,
        headers: {
          pinata_api_key: `${IPFS_API_KEY}`,
          pinata_secret_api_key: `${IPFS_API_SECRET}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setImageUri(`https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`)
    } catch (error) {
      console.error('Error sending File to IPFS: ')
      console.error(error)
    }
  }

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
  const metadata_description = 'A Nengajo sent using HENKAKU Nengajo.'
  const metadata_external_url = 'https://henkaku-nengajo.vercel.app'

  useEffect(() => {
    if (imageUri === '') return
    if (address === undefined) return
    if (metadataName === '') return

    const putMetadataOnIPFS = async (metadata: NengajoTokenMetadata) => {
      console.log('Putting metadata on IPFS', metadata)
      const url = IPFS_API_ENDPOINT + '/pinning/pinJSONToIPFS'

      const pinataRequest = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: `${IPFS_API_KEY}`,
          pinata_secret_api_key: `${IPFS_API_SECRET}`
        },
        body: JSON.stringify(metadata)
      })
      var res = await pinataRequest.json()
      setMetadataUri(`https://gateway.pinata.cloud/ipfs/${res.IpfsHash}`)
      console.log(
        'Metadata IPFS URI:',
        `https://gateway.pinata.cloud/ipfs/${res.IpfsHash}`
      )
    }
    const metadata: NengajoTokenMetadata = {
      name: metadataName,
      description: metadata_description,
      image: imageUri,
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

    putMetadataOnIPFS(metadata)
  }, [imageUri, address, metadataName])

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
        <Box mt="2em">
          <Heading as="h2" color="white.600">
            {t('CREATE_NEW_NENGAJO')}
          </Heading>
          <FormControl color="white.700">
            <FormControl isRequired mt={5}>
              <FormLabel htmlFor="imageFile">{t('PICTURE')}</FormLabel>
              <form onSubmit={sendFileToIPFS}>
                <Input
                  variant="outline"
                  id="imageFile"
                  type="file"
                  accept={'image/*'}
                  isRequired={true}
                  placeholder="Your nengajo"
                  name="profilePicture"
                  onChange={handleImageChange}
                />
                {metadataUri !== '' ? (
                  <Box>
                    {t('UPLOAD_SUCCESS')}
                    <Image
                      src={imageUri ?? ''}
                      alt={'Uploaded image: ' + imageUri}
                    ></Image>
                    <Link href={metadataUri}>Metadata JSON</Link>
                  </Box>
                ) : (
                  <Button
                    mt={10}
                    colorScheme="green"
                    onClick={sendFileToIPFS}
                    isLoading={isLoading}
                  >
                    {t('BUTTON_CREATE')}
                  </Button>
                )}
              </form>
            </FormControl>
          </FormControl>
        </Box>
      )}
    </Layout>
  )
}

export default Home
