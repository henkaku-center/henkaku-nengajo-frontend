import { useState } from 'react'
import type { NextPage } from 'next'
import {
  Box,
  Container,
  Heading,
  Button,
  Image,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react'
import { useMounted } from '../hooks'
import { Connect } from '../components/Connect'
import { useAccount } from 'wagmi'
import axios from 'axios';

const IPFS_API_KEY = process.env.NEXT_PUBLIC_IPFS_API_KEY
const IPFS_API_SECRET = process.env.NEXT_PUBLIC_IPFS_API_SECRET
const IPFS_API_ENDPOINT = process.env.NEXT_PUBLIC_IPFS_API_ENDPOINT

const Home: NextPage = () => {
  const isMounted = useMounted()
  const { address, isConnected } = useAccount()
  const [fileImg, setFileImg] = useState<File | null>()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [imageUri, setImageUri] = useState('')

  const handleImageChange = async (e: any) => {
    setFileImg(e?.target?.files[0])
  }
  const sendFileToIPFS = async (e: any) => {
    if (fileImg === undefined || fileImg === null) return
    setIsLoading(true)
    try {
      const formData = new FormData();
      formData.append("file", fileImg);
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          'pinata_api_key': `${process.env.NEXT_PUBLIC_IPFS_API_KEY}`,
          'pinata_secret_api_key': `${process.env.NEXT_PUBLIC_IPFS_API_SECRET}`,
          "Content-Type": "multipart/form-data"
        },
      });
      setImageUri(`https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`);
      setIsSuccess(true)
    } catch (error) {
      console.error("Error sending File to IPFS: ")
      console.error(error)
    }
  }

  return (
    <Box>
      <Container maxW="container.sm" mt="4em">
        <Heading as="h1" size="4xl">
          Henkaku Nengajo
        </Heading>
        {isMounted && (
          <Box mt="2em">
            <Connect />
          </Box>
        )}
        {isMounted && isConnected && (
          <>
            <Heading as="h2" color="white.600">
              Register a new nengajo
            </Heading>
            <FormControl color="white.700">
              <FormControl isRequired mt={5}>
                <FormLabel htmlFor="imageFile">Picture</FormLabel>

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
                  {isSuccess ?
                    <Box>
                      Upload Success
                      <Image src={imageUri ?? ''}></Image>
                    </Box>
                    :
                    <Button
                      mt={10}
                      colorScheme="green"
                      onClick={sendFileToIPFS}
                      isLoading={isLoading}
                    >
                      Register
                    </Button>

                  }
                </form>
              </FormControl>


            </FormControl>
          </>
        )}
      </Container>
    </Box>
  )
}

export default Home
