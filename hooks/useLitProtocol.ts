import { contractAddresses } from '@/utils/contractAddresses'
import { useEffect, useState } from 'react'
import { useChainId } from './useChainId'
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

export const useLitEncryption = () => {
  const litClient = useLitClient()
  const { chainId } = useChainId()
  const accessControlConditions = [
    {
      contractAddress: contractAddresses['nengajo'][chainId],
      standardContractType: 'ERC1155',
      chain: 'mumbai',
      method: 'balanceOf',
      parameters: [':userAddress', '1'],
      returnValueTest: {
        comparator: '>=',
        value: '1'
      }
    }
  ]

  const encrypt = async (message: string = 'this is secret message') => {
    if (!litClient) return
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: 'mumbai' })
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      message
    )
    const encryptedSymmetricKey = await litClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: 'mumbai'
    })

    return {
      encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        'base16'
      )
    }
  }

  return { encrypt }
}

export const useLitDecryption = () => {
  const litClient = useLitClient()
  const { chainId } = useChainId()
  const accessControlConditions = [
    {
      contractAddress: contractAddresses['nengajo'][chainId],
      standardContractType: 'ERC1155',
      chain: 'mumbai',
      method: 'balanceOf',
      parameters: [':userAddress', '1'],
      returnValueTest: {
        comparator: '>=',
        value: '1'
      }
    }
  ]

  const decrypt = async (
    encryptedString: string,
    encryptedSymmetricKey: string
  ) => {
    try {
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: 'mumbai'
      })
      const symmetricKey = await litClient.getEncryptionKey({
        accessControlConditions,
        toDecrypt: encryptedSymmetricKey,
        chain: 'mumbai',
        authSig
      })
      const decryptedString = await LitJsSdk.decryptString(
        encryptedString,
        symmetricKey
      )
      return { decryptedString }
    } catch (error) {
      console.log(error)
    }
  }

  return { decrypt }
}
