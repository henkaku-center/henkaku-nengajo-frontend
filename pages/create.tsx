import { useState } from 'react'
import type { NextPage } from 'next'
import {
  Box,
  Heading,
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
import { useRegisterNengajo } from '@/hooks/useNengajoContract'

const IPFS_API_KEY = process.env.NEXT_PUBLIC_IPFS_API_KEY
const IPFS_API_SECRET = process.env.NEXT_PUBLIC_IPFS_API_SECRET
const IPFS_API_ENDPOINT = process.env.NEXT_PUBLIC_IPFS_API_ENDPOINT

const Home: NextPage = () => {
  const isMounted = useMounted()
  const { t } = useTranslation('common')
  const { isConnected } = useAccount()
  const [fileImg, setFileImg] = useState<File | null>()
  const [isLoading, setIsLoading] = useState(false)
  const [imageUri, setImageUri] = useState('')
  const { isLoading: txIsLoading, isSuccess, writeAsync } = useRegisterNengajo()

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
      await txWithContract(
        10,
        `ipfs://${resFile.data.IpfsHash}/${fileImg.name}`
      )
    } catch (error) {
      console.error('Error sending File to IPFS: ')
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
        <>
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
                {imageUri !== '' ? (
                  <Box>
                    {t('UPLOAD_SUCCESS')}
                    <Image
                      src={imageUri ?? ''}
                      alt={'Uploaded image: ' + imageUri}
                    ></Image>
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
        </>
      )}

      {isSuccess ? 'Success' : 'Waiting'}
    </Layout>
  )
}

export default Home
