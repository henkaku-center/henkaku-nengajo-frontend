import { useState } from 'react'
import type { NextPage } from 'next'
import {
  Box,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react'
import { useMounted } from '@/hooks'
import { Connect } from '@/components/Connect'
import Layout from '@/components/Layout'
import { useAccount } from 'wagmi'
import useTranslation from 'next-translate/useTranslation'

const IPFS_API_KEY = process.env.NEXT_PUBLIC_IPFS_API_KEY
const IPFS_API_SECRET = process.env.NEXT_PUBLIC_IPFS_API_SECRET
const IPFS_API_ENDPOINT = process.env.NEXT_PUBLIC_IPFS_API_ENDPOINT

const Home: NextPage = () => {
  const isMounted = useMounted()
  const { t } = useTranslation('common')
  const { address, isConnected } = useAccount()

  const submitGenerateImage = async () => {
    console.log('submitGenerateImage')
  }
  const handleImageChange = async (e: any) => {
    console.log(e.target.value)
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
            Register a new nengajo
          </Heading>
          <FormControl color="white.700">
            <FormControl isRequired mt={5}>
              <FormLabel htmlFor="imageFile">Picture</FormLabel>
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
            </FormControl>
            <Button
              mt={10}
              colorScheme="green"
              type="submit"
              onClick={submitGenerateImage}
            >
              Register
            </Button>
          </FormControl>
        </>
      )}
    </Layout>
  )
}

export default Home
