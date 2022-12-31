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
import { useEffect, useMemo, useState } from 'react'
import { BigNumber } from 'ethers'
import { HIDE_NENGAJO_LIST } from '@/constants/Nengajo'

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

const usePrepareNengajoContractWrite = (functionName: string, args: any[]) => {
  const { config } = usePrepareContractWrite({
    address: getContractAddress({ name: 'nengajo', chainId }),
    abi: NengajoABI.abi,
    functionName,
    args,
    overrides: {
      gasLimit: BigNumber.from(650000)
    }
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

  const filteredNengajo = useMemo(() => {
    return (
      data?.filter((n) => !HIDE_NENGAJO_LIST.includes(n.id.toNumber())) || []
    )
  }, [data])

  return { filteredNengajo, isLoading, isError }
}

export const useIsHoldingByTokenId = (tokenId: number) => {
  const [isHolding, setIsHolding] = useState(false)
  const { address } = useAccount()
  const { data, isError, isLoading } = useNengajoContractRead('balanceOf', [
    address,
    tokenId
  ]) as {
    data: BigNumber
    isLoading: boolean
    isError: boolean
  }

  useEffect(() => {
    if (data?.toNumber() > 0) {
      setIsHolding(true)
    } else {
      setIsHolding(false)
    }
  }, [data, address])

  return { isHolding, isLoading, isError }
}

export const useCalcRequiredHenkakuAmount = (maxSupply: number) => {
  const normalizedMaxSupply = useMemo(() => {
    return Number(maxSupply) ? Number(maxSupply) : 0
  }, [maxSupply])

  const { data, isLoading } = useNengajoContractRead('calcPrice', [
    normalizedMaxSupply
  ]) as { data: BigNumber; isLoading: boolean }

  return { data, isLoading }
}
