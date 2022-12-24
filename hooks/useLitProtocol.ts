import { contractAddresses } from '@/utils/contractAddresses'
import { useEffect, useState } from 'react'
import { useChainId } from './useChainId'
import { blobToBase64, base64ToBlob } from 'base64-blob'
const LitJsSdk = require('@lit-protocol/sdk-browser')

export const useLitClient = () => {
  const [litClient, setLitClient] = useState<any>(null)
  useEffect(() => {
    const init = async () => {
      const client = new LitJsSdk.LitNodeClient()
      await client.connect()
      setLitClient(client)
    }
    init()
  }, [])
  return litClient
}

const chainName = (chainId: number) => {
  switch (chainId) {
    case 80001:
      return 'mumbai'
    case 137:
      return 'polygon'
    default:
      return ''
  }
}

const generateAccessControlConditions = (tokenId: number, chainId: number) => {
  return [
    {
      contractAddress: contractAddresses['nengajo'][chainId],
      standardContractType: 'ERC1155',
      chain: chainName(chainId),
      method: 'balanceOf',
      parameters: [':userAddress', `${tokenId}`],
      returnValueTest: {
        comparator: '>=',
        value: '1'
      }
    }
  ]
}

export const useLitEncryption = () => {
  const litClient = useLitClient()
  const { chainId } = useChainId()
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState('')

  const initEncrypt = async (file: File) => {
    if (!litClient) return
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: chainName(chainId)
    })
    const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({ file })
    const stringifiedEncryptedFile = await blobToBase64(encryptedFile)
    const encryptedSymmetricKey = await litClient.saveEncryptionKey({
      accessControlConditions: generateAccessControlConditions(7, chainId),
      symmetricKey,
      authSig,
      chain: chainName(chainId),
      permanent: false
    })

    setEncryptedSymmetricKey(
      LitJsSdk.uint8arrayToString(encryptedSymmetricKey, 'base16')
    )

    return {
      stringifiedEncryptedFile,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        'base16'
      )
    }
  }

  const updateEncrypt = async (tokenId: number, encryptedSymmetricKey: any) => {
    if (!litClient) return
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: chainName(chainId)
    })
    await litClient.saveEncryptionKey({
      accessControlConditions: generateAccessControlConditions(
        tokenId,
        chainId
      ),
      encryptedSymmetricKey: LitJsSdk.uint8arrayFromString(
        encryptedSymmetricKey,
        'base16'
      ),
      authSig,
      chain: chainName(chainId),
      permanent: false
    })
  }

  return { initEncrypt, updateEncrypt, encryptedSymmetricKey }
}

export const useLitDecryption = (tokenId: number) => {
  const litClient = useLitClient()
  const { chainId } = useChainId()
  const accessControlConditions = generateAccessControlConditions(
    tokenId,
    chainId
  )

  const decrypt = async (
    encryptedFile: string,
    encryptedSymmetricKey: string
  ) => {
    try {
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: chainName(chainId)
      })
      const symmetricKey = await litClient.getEncryptionKey({
        accessControlConditions,
        toDecrypt: encryptedSymmetricKey,
        chain: chainName(chainId),
        authSig
      })
      const blob = await base64ToBlob(encryptedFile)
      const decryptedFile = await LitJsSdk.decryptFile({
        file: blob,
        symmetricKey
      })
      return { decryptedFile }
    } catch (error) {
      console.log(error)
    }
  }

  return { decrypt }
}
