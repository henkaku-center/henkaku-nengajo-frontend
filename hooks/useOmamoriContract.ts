import {
  useAccount,
  useContract,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
  useProvider,
  Chain
} from 'wagmi'
import { getContractAddress } from '@/utils/contractAddresses'
import OmamoriABI from '@/abi/Omamori.json'
import FowarderABI from '@/abi/Forwarder.json'
import { Omamori } from '@/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber, ethers, providers } from 'ethers'
import { signMetaTxRequest } from '@/utils/signer'
import axios from 'axios'

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

const usePrepareOmamoriContractWrite = (functionName: string, args: any[]) => {
  const { config } = usePrepareContractWrite({
    address: getContractAddress({ name: 'omamori', chainId }),
    abi: OmamoriABI.abi,
    functionName,
    args,
    overrides: {
      gasLimit: BigNumber.from(1100000)
    }
  })
  return config
}

const useOmamoriContractRead = (functionName: string, args: unknown[] = []) => {
  const result = useContractRead({
    address: getContractAddress({ name: 'omamori', chainId }),
    abi: OmamoriABI.abi,
    functionName,
    args
  })
  return result
}

const useOmamoriContractEvent = (
  eventName: string,
  listener: (...args: any) => void
) => {
  useContractEvent({
    address: getContractAddress({ name: 'omamori', chainId }),
    abi: OmamoriABI.abi,
    eventName,
    listener
  })
}

export const useRegisterOmamori = (maxSupply: number, metadataURI: string) => {
  const [registeredTokenId, setRegisteredTokenId] = useState<number>()
  const config = usePrepareOmamoriContractWrite('registerNengajo', [
    maxSupply,
    metadataURI || 'ipfs://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  ])
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)
  useOmamoriContractEvent(
    'RegisterNengajo',
    (creator, _tokenId, metaDataURL, maxSupply) => {
      setRegisteredTokenId(_tokenId)
    }
  )

  return { data, isLoading, isSuccess, writeAsync, registeredTokenId }
}

export const useMintOmamori = (id: number) => {
  const [minted, setMinted] = useState(false)
  const { address } = useAccount()
  const config = usePrepareOmamoriContractWrite('mint', [id])
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)
  useOmamoriContractEvent('Mint', (minter: string, tokenId: BigNumber) => {
    if (tokenId.toNumber() === id && minter === address) {
      setMinted(true)
    }
  })
  return { data, isLoading, isSuccess, writeAsync, minted }
}

export const useBatchMintOmamoris = (id: number[]) => {
  // TODO: BatchMint
  return
}

export const useRetrieveOmamoriByTokenId = (tokenId: number) => {
  const { data, isLoading, isError } = useOmamoriContractRead(
    'retrieveRegisteredNengajo',
    [tokenId]
  ) as {
    data: Omamori.NengajoInfoStructOutput
    isLoading: boolean
    isError: boolean
  }

  return { data, isLoading, isError }
}

export const useRetrieveHoldingOmamorisByAddress = (address: string) => {
  const { data, isLoading, isError } = useOmamoriContractRead(
    'retrieveMintedNengajoes',
    [address]
  ) as {
    data: Omamori.NengajoInfoStructOutput[]
    isLoading: boolean
    isError: boolean
  }

  return { data, isLoading, isError }
}

export const useRetrieveAllOmamori = () => {
  const { data, isError, isLoading } = useOmamoriContractRead(
    'retrieveAllNengajoes'
  ) as {
    data: Omamori.NengajoInfoStructOutput[]
    isLoading: boolean
    isError: boolean
  }

  return { data, isLoading, isError }
}

export const useIsHoldingByTokenId = (tokenId: number) => {
  const [isHolding, setIsHolding] = useState(false)
  const { address } = useAccount()
  const { data, isError, isLoading } = useOmamoriContractRead('balanceOf', [
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

  const { data, isLoading } = useOmamoriContractRead('calcPrice', [
    normalizedMaxSupply
  ]) as { data: BigNumber; isLoading: boolean }

  return { data, isLoading }
}

export const useCurrentSupply = (id: number) => {
  const { data, isError, isLoading } = useOmamoriContractRead('totalSupply', [
    id
  ]) as { data: BigNumber; isLoading: boolean; isError: boolean }

  return { data, isError, isLoading }
}

export const useMintOmamoriWithMx = (id: number) => {
  const { data: signer } = useSigner()
  const omamoriContract = useContract({
    address: getContractAddress({ name: 'omamori', chainId }),
    abi: OmamoriABI.abi
  })
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [minted, setMinted] = useState(false)

  useOmamoriContractEvent('Mint', (minter: string, tokenId: BigNumber) => {
    if (tokenId.toNumber() === id && minter === address) {
      setIsLoading(false)
      setMinted(true)
    }
  })

  const sendMetaTx = useCallback(async () => {
    console.log('sendMetaTx start')
    try {
      console.log('sendMetaTx 0')
      console.log('signer', signer)
      if (!signer || !omamoriContract) return
      setIsLoading(true)

      console.log('sendMetaTx 1')

      const forwarder = new ethers.Contract(
        getContractAddress({ name: 'Forwarder', chainId }),
        FowarderABI.abi,
        signer
      )

      console.log('sendMetaTx 2')

      const from = await signer.getAddress()

      console.log('sendMetaTx 3')
      const data = omamoriContract.interface.encodeFunctionData('mint', [
        Number(id)
      ])

      console.log('sendMetaTx 4')

      const to = omamoriContract.address

      console.log('sendMetaTx 5')

      if (!signer.provider) throw new Error('Provider is not set')

      console.log('sendMetaTx 6')

      const request = await signMetaTxRequest(signer.provider, forwarder, {
        to,
        from,
        data
      })

      console.log('sendMetaTx 7')

      const { data: resData } = await axios.post('/api/relay', request)

      console.log('sendMetaTx 8')

      if (resData.status === 'error') {
        throw resData
      }

      console.log('sendMetaTx end')

      return
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }, [signer, chainId])

  return { sendMetaTx, isLoading, minted }
}

export const useSetApprovalForAllOmamoriWithMx = () => {
  const { data: signer } = useSigner()
  const omamoriContract = useContract({
    address: getContractAddress({ name: 'omamori', chainId }),
    abi: OmamoriABI.abi
  })
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [approved, setApproved] = useState(false)

  useOmamoriContractEvent(
    'ApprovalForAll',
    (account: string, operator: string, approved: boolean) => {
      if (
        account === address &&
        operator === getContractAddress({ name: 'otakiage', chainId })
      ) {
        setIsLoading(false)
        setApproved(true)
      }
    }
  )

  const sendMetaTx = useCallback(async () => {
    console.log('sendMetaTx start')
    try {
      console.log('sendMetaTx 0')
      console.log('signer', signer)
      if (!signer || !omamoriContract) return
      setIsLoading(true)

      console.log('sendMetaTx 1')

      const forwarder = new ethers.Contract(
        getContractAddress({ name: 'Forwarder', chainId }),
        FowarderABI.abi,
        signer
      )

      console.log('sendMetaTx 2')

      const from = await signer.getAddress()

      console.log('sendMetaTx 3')
      const data = omamoriContract.interface.encodeFunctionData(
        'setApprovalForAll',
        [getContractAddress({ name: 'otakiage', chainId }), true]
      )

      console.log('sendMetaTx 4')

      const to = omamoriContract.address

      console.log('sendMetaTx 5')

      if (!signer.provider) throw new Error('Provider is not set')

      console.log('sendMetaTx 6')

      const request = await signMetaTxRequest(signer.provider, forwarder, {
        to,
        from,
        data
      })

      console.log('sendMetaTx 7')

      const { data: resData } = await axios.post('/api/relay', request)

      console.log('sendMetaTx 8')

      if (resData.status === 'error') {
        throw resData
      }

      console.log('sendMetaTx end')

      return
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }, [signer, chainId])

  return { sendMetaTx, isLoading, approved }
}
