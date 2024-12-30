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
import OtakiageABI from '@/abi/Otakiage.json'
import FowarderABI from '@/abi/Forwarder.json'
import { Otakiage } from '@/types/contracts/community/Otakiage'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber, ethers, providers } from 'ethers'
import { signMetaTxRequest } from '@/utils/signer'
import axios from 'axios'
import { IOmamori, Nengajo } from '@/types'

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

const usePrepareOtakiageContractWrite = (functionName: string, args: any[]) => {
  const { config } = usePrepareContractWrite({
    address: getContractAddress({ name: 'otakiage', chainId }),
    abi: OtakiageABI.abi,
    functionName,
    args,
    overrides: {
      gasLimit: BigNumber.from(1100000)
    }
  })
  return config
}

const useOtakiageContractRead = (
  functionName: string,
  args: unknown[] = []
) => {
  const result = useContractRead({
    address: getContractAddress({ name: 'otakiage', chainId }),
    abi: OtakiageABI.abi,
    functionName,
    args
  })
  return result
}

const useOtakiageContractEvent = (
  eventName: string,
  listener: (...args: any) => void
) => {
  useContractEvent({
    address: getContractAddress({ name: 'otakiage', chainId }),
    abi: OtakiageABI.abi,
    eventName,
    listener
  })
}

export const useGetOtakiageOmamoriBalances = () => {
  const { data, isLoading, isError } = useOtakiageContractRead(
    'getOmamoriBalances',
    []
  ) as {
    data: BigNumber
    isLoading: boolean
    isError: boolean
  }
  return { data, isLoading, isError }
}

export const useFetchOtakiageOmamoriIds = () => {
  const { data: otakiageOmamoriBalances } = useGetOtakiageOmamoriBalances()
  const [otakiageOmamoriIds, setOtakiageOmamoriIds] = useState<BigNumber[]>([])

  useEffect(() => {
    if (otakiageOmamoriBalances) {
      const balances = otakiageOmamoriBalances as unknown as BigNumber[]
      const ids: BigNumber[] = []
      balances.forEach((balance, i) => {
        if (balance.toNumber() > 0) {
          ids.push(BigNumber.from(i + 1))
        }
      })
      setOtakiageOmamoriIds(ids)
    }
  }, [otakiageOmamoriBalances])

  return { otakiageOmamoriIds }
}

export const useFetchOtakiageOmamories = () => {
  const { data, isLoading, isError } = useOtakiageContractRead(
    'getOtakiageOmamoriInfo',
    []
  ) as {
    data: Nengajo.NengajoInfoStructOutput[]
    isLoading: boolean
    isError: boolean
  }
  return { data, isLoading, isError }
}

export const useRegisterOtakiage = (maxSupply: number, metadataURI: string) => {
  const [registeredTokenId, setRegisteredTokenId] = useState<number>()
  const config = usePrepareOtakiageContractWrite('registerNengajo', [
    maxSupply,
    metadataURI || 'ipfs://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  ])
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)
  useOtakiageContractEvent(
    'RegisterNengajo',
    (creator, _tokenId, metaDataURL, maxSupply) => {
      setRegisteredTokenId(_tokenId)
    }
  )

  return { data, isLoading, isSuccess, writeAsync, registeredTokenId }
}

export const useMintOtakiage = (id: number) => {
  const [minted, setMinted] = useState(false)
  const { address } = useAccount()
  const config = usePrepareOtakiageContractWrite('mint', [id])
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)
  useOtakiageContractEvent('Mint', (minter: string, tokenId: BigNumber) => {
    if (tokenId.toNumber() === id && minter === address) {
      setMinted(true)
    }
  })
  return { data, isLoading, isSuccess, writeAsync, minted }
}

export const useIsHoldingByTokenId = (tokenId: number) => {
  const [isHolding, setIsHolding] = useState(false)
  const { address } = useAccount()
  const { data, isError, isLoading } = useOtakiageContractRead('balanceOf', [
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

  const { data, isLoading } = useOtakiageContractRead('calcPrice', [
    normalizedMaxSupply
  ]) as { data: BigNumber; isLoading: boolean }

  return { data, isLoading }
}

export const useCurrentSupply = (id: number) => {
  const { data, isError, isLoading } = useOtakiageContractRead('totalSupply', [
    id
  ]) as { data: BigNumber; isLoading: boolean; isError: boolean }

  return { data, isError, isLoading }
}

export const useMintOtakiageWithMx = (id: number) => {
  const { data: signer } = useSigner()
  const otakiageContract = useContract({
    address: getContractAddress({ name: 'otakiage', chainId }),
    abi: OtakiageABI.abi
  })
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [minted, setMinted] = useState(false)

  useOtakiageContractEvent('Mint', (minter: string, tokenId: BigNumber) => {
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
      if (!signer || !otakiageContract) return
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
      const data = otakiageContract.interface.encodeFunctionData('mint', [
        Number(id)
      ])

      console.log('sendMetaTx 4')

      const to = otakiageContract.address

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

export const useIsAdmin = () => {
  const { address } = useAccount()
  const { data, isLoading, isError } = useOtakiageContractRead('isAdmin', [
    address
  ]) as {
    data: boolean
    isLoading: boolean
    isError: boolean
  }
  return { isAdmin: data, isLoading, isError }
}

export const useTokenIds = () => {
  const { data: tokenIds } = useOtakiageContractRead('tokenIds', []) as {
    data: BigNumber
  }
  return { tokenIds }
}

export const useIsOtakiaged = () => {
  const [isOtakiaged, setIsOtakiaged] = useState(false)
  const { tokenIds } = useTokenIds()

  useEffect(() => {
    if (Number(tokenIds) > 0) {
      setIsOtakiaged(true)
    } else {
      setIsOtakiaged(false)
    }
  }, [tokenIds])

  console.log('useIsOtakiaged isOtakiaged', isOtakiaged)

  return { isOtakiaged }
}

export const useOtakiage = () => {
  const [otakiaged, setOtakiaged] = useState(false)
  const { address } = useAccount()
  const config = usePrepareOtakiageContractWrite('otakiage', [])
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)
  useOtakiageContractEvent('OtakiageEvent', (users: string[]) => {
    // if (address && users.includes(address)) {
    if (address) {
      setOtakiaged(true)
    }
  })

  return { data, isLoading, isSuccess, writeAsync, otakiaged }
}

export const useSendAllOmamoriWithMx = () => {
  const { data: signer } = useSigner()
  const otakiageContract = useContract({
    address: getContractAddress({ name: 'otakiage', chainId }),
    abi: OtakiageABI.abi
  })
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useOtakiageContractEvent(
    'SendAllOmamori',
    (from: string, ids: BigNumber[], values: BigNumber[]) => {
      if (from === address) {
        setIsLoading(false)
        setIsSuccess(true)
      }
    }
  )

  const sendMetaTx = useCallback(async () => {
    console.log('sendMetaTx start')
    try {
      console.log('sendMetaTx 0')
      console.log('signer', signer)
      if (!signer || !otakiageContract) return
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
      const data = otakiageContract.interface.encodeFunctionData(
        'sendAllOmamori',
        []
      )

      console.log('sendMetaTx 4')

      const to = otakiageContract.address

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

  return { sendMetaTx, isLoading, isSuccess }
}
