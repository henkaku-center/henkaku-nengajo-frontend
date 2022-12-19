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

const usePrepareNengajoContractWrite = (functionName: string, args: any[]) => {
  const { config } = usePrepareContractWrite({
    address: getContractAddress({ name: 'nengajo', chainId }),
    abi: NengajoABI.abi,
    functionName,
    args
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
  const config = usePrepareNengajoContractWrite('registerNengajo', [10, ''])
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)
  useNengajoContractEvent('RegisterNengajo', (tokenId: number) =>
    setRegisteredTokenId(tokenId)
  )

  return { data, isLoading, isSuccess, writeAsync, registeredTokenId }
}

export const useMintNengajo = (id: number) => {
  const [minted, setMinted] = useState(false)
  const config = usePrepareNengajoContractWrite('mint', [id])
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)
  useNengajoContractEvent('Mint', () => {
    setMinted(true)
  })
  return { data, isLoading, isSuccess, writeAsync, minted }
}

export const useBatchMintNengajoes = (id: number[]) => {
  // TODO: BatchMint
  return
}

export const useRetrieveNengajoByTokenId = (tokenId: number) => {
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

export const useRetrieveHoldingNengajoesByAddress = (address: string) => {
  const { data, isLoading, isError } = useNengajoContractRead(
    'retrieveMintedNengajoes',
    [address]
  ) as {
    data: Nengajo.NengajoInfoStructOutput[]
    isLoading: boolean
    isError: boolean
  }

  return { data, isLoading, isError }
}
