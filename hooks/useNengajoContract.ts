import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite
} from 'wagmi'
import { getContractAddress } from '@/utils/contractAddresses'
import NengajoABI from '@/abi/Nengajo.json'
import { Nengajo } from '@/types'
import { useState } from 'react'
import { BigNumber } from 'ethers'

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
  listener: (...args: any) => void
) => {
  useContractEvent({
    address: getContractAddress({ name: 'nengajo', chainId }),
    abi: NengajoABI.abi,
    eventName,
    listener
  })
}

export const useRegisterNengajo = (maxSupply: number, metadataURI: string) => {
  const [registeredTokenId, setRegisteredTokenId] = useState<number>()
  const config = usePrepareNengajoContractWrite('registerNengajo', [
    maxSupply,
    metadataURI || 'ipfs://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  ])
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)
  useNengajoContractEvent(
    'RegisterNengajo',
    (creator, _tokenId, metaDataURL, maxSupply) => {
      setRegisteredTokenId(_tokenId)
    }
  )

  return { data, isLoading, isSuccess, writeAsync, registeredTokenId }
}

export const useMintNengajo = (id: number) => {
  const [minted, setMinted] = useState(false)
  const { address } = useAccount()
  const config = usePrepareNengajoContractWrite('mint', [id])
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)
  useNengajoContractEvent('Mint', (minter: string, tokenId: BigNumber) => {
    if (tokenId.toNumber() === id && minter === address) {
      setMinted(true)
    }
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

export const useRetrieveAllNengajo = () => {
  const { data, isError, isLoading } = useNengajoContractRead(
    'retrieveAllNengajoes'
  ) as {
    data: Nengajo.NengajoInfoStructOutput[]
    isLoading: boolean
    isError: boolean
  }
  return { data, isLoading, isError }
}
