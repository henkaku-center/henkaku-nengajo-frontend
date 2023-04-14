import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite
} from 'wagmi'
import { getContractAddress } from '@/utils/contractAddresses'
import TicketABI from '@/abi/Ticket.json'
import { Ticket } from '@/types'
import { useEffect, useMemo, useState } from 'react'
import { BigNumber } from 'ethers'

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

const usePrepareTicketContractWrite = (functionName: string, args: any[]) => {
  const { config } = usePrepareContractWrite({
    address: getContractAddress({ name: 'ticket', chainId }),
    abi: TicketABI.abi,
    functionName,
    chainId,
    args,
    overrides: {
      gasLimit: BigNumber.from(1100000)
    }
  })
  return config
}

const useTicketContractRead = (functionName: string, args: unknown[] = []) => {
  const result = useContractRead({
    address: getContractAddress({ name: 'ticket', chainId }),
    abi: TicketABI.abi,
    functionName,
    args
  })
  return result
}

const useTicketContractEvent = (
  eventName: string,
  listener: (...args: any) => void
) => {
  useContractEvent({
    address: getContractAddress({ name: 'ticket', chainId }),
    abi: TicketABI.abi,
    eventName,
    listener
  })
}

export const useRegisterTicket = (
  maxSupply: number,
  metadataURI: string,
  price: number,
  blockTimeStamp: Date[]
) => {
  const [registeredTokenId, setRegisteredTokenId] = useState<number>()
  const open_blockTimeStamp = Math.floor(
    (blockTimeStamp[0]?.getTime() || Date.now()) / 1000
  )
  const close_clockTimeStamp = Math.floor(
    (blockTimeStamp[1]?.getTime() || Date.now()) / 1000
  )
  const config = usePrepareTicketContractWrite('registerTicket', [
    maxSupply,
    metadataURI || 'ipfs://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    price,
    open_blockTimeStamp,
    close_clockTimeStamp,
    [
      process.env.NEXT_PUBLIC_CONTRACT_POOLWALLET_ADDRESS ||
        '0x0000000000000000000000000000000000000000'
    ],
    [100]
  ])

  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)

  useTicketContractEvent(
    'RegisterTicket',
    (
      creator,
      open_blockTimeStamp,
      close_blockTimeStamp,
      maxSupply,
      _tokenId,
      price,
      metaDataURL
    ) => {
      setRegisteredTokenId(_tokenId)
    }
  )

  return { data, isLoading, isSuccess, writeAsync, registeredTokenId }
}

export const useMintTicket = (id: number) => {
  const [minted, setMinted] = useState(false)
  const { address } = useAccount()
  const config = usePrepareTicketContractWrite('mint', [id])
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)
  useTicketContractEvent('Mint', (minter: string, tokenId: BigNumber) => {
    if (tokenId.toNumber() === id && minter === address) {
      setMinted(true)
    }
  })
  return { data, isLoading, isSuccess, writeAsync, minted }
}

export const useBatchMintTickets = (id: number[]) => {
  // TODO: BatchMint
  return
}

export const useRetrieveTicketByTokenId = (tokenId: number) => {
  const { data, isLoading, isError } = useTicketContractRead(
    'retrieveRegisteredTicket',
    [tokenId]
  ) as {
    data: Ticket.TicketInfoStructOutput
    isLoading: boolean
    isError: boolean
  }

  return { data, isLoading, isError }
}

export const useRetrieveHoldingTicketsByAddress = (address: string) => {
  const { data, isLoading, isError } = useTicketContractRead(
    'retrieveMintedTickets',
    [address]
  ) as {
    data: Ticket.TicketInfoStructOutput[]
    isLoading: boolean
    isError: boolean
  }

  return { data, isLoading, isError }
}

export const useRetrieveAllTicket = () => {
  const { data, isError, isLoading } = useTicketContractRead(
    'retrieveAllTickets'
  ) as {
    data: Ticket.TicketInfoStructOutput[]
    isLoading: boolean
    isError: boolean
  }

  return { data, isLoading, isError }
}

export const useIsHoldingByTokenId = (tokenId: number) => {
  const [isHolding, setIsHolding] = useState(false)
  const { address } = useAccount()
  const { data, isError, isLoading } = useTicketContractRead('balanceOf', [
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

  const { data, isLoading } = useTicketContractRead('calcPrice', [
    normalizedMaxSupply
  ]) as { data: BigNumber; isLoading: boolean }

  return { data, isLoading }
}

export const useCurrentSupply = (id: number) => {
  const { data, isError, isLoading } = useTicketContractRead('totalSupply', [
    id
  ]) as { data: BigNumber; isLoading: boolean; isError: boolean }

  return { data, isError, isLoading }
}
