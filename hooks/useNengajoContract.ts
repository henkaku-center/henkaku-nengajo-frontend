import {
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite
} from 'wagmi'
import { getContractAddress } from '@/utils/contractAddresses'
import NengajoABI from '@/abi/Nengajo.json'
import { Nengajo } from '@/types'
import { useState } from 'react'

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

const usePrepareNengajoContractWrite = (functionName: string) => {
  const { config } = usePrepareContractWrite({
    address: getContractAddress({ name: 'nengajo', chainId }),
    abi: NengajoABI.abi,
    functionName,
    args: [10, '']
  })
  return config
}

const useNengajoContractRead = (functionName: string, args: unknown[] = []) => {
  const result = useContractRead({
    address: getContractAddress({ name: 'nengajo', chainId }),
    abi: NengajoABI.abi,
    functionName,
    args
  })
  return result
}

const useNengajoContractEvent = (
  eventName: string,
  callback: (tokenId: number) => void
) => {
  useContractEvent({
    address: getContractAddress({ name: 'nengajo', chainId }),
    abi: NengajoABI.abi,
    eventName,
    listener(creator, _tokenId, metaDataURL, maxSupply) {
      callback(_tokenId)
    }
  })
}

export const useRegisterNengajo = () => {
  const [registeredTokenId, setRegisteredTokenId] = useState<number>()
  const config = usePrepareNengajoContractWrite('registerNengajo')
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)
  useNengajoContractEvent('RegisterNengajo', (tokenId: number) =>
    setRegisteredTokenId(tokenId)
  )

  return { data, isLoading, isSuccess, writeAsync, registeredTokenId }
}

export const useRetrieveNengajo = (tokenId: number) => {
  const { data, isLoading, isError } = useNengajoContractRead(
    'retrieveRegisteredNengajo',
    [tokenId]
  ) as {
    data: Nengajo.NengajoInfoStructOutput
    isLoading: boolean
    isError: boolean
  }

  return { data, isLoading, isError }
}
