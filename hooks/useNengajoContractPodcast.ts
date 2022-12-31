import { BigNumber, ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import FowarderABI from '@/abi/Forwarder.json'
import PublicNengajoABI from '@/abi/PublicNengajo.json'
import { signMetaTxRequest } from '@/utils/signer'
import {
  useAccount,
  useContract,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner
} from 'wagmi'
import { getContractAddress } from '@/utils/contractAddresses'
import axios from 'axios'

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)

export const useMintNengajoWithMx = () => {
  const { data: signer } = useSigner()
  const nengajoContract = useContract({
    address: getContractAddress({ name: 'podcastNengajo', chainId }),
    abi: PublicNengajoABI.abi
  })
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setSuccess] = useState(false)

  useContractEvent({
    address: getContractAddress({ name: 'podcastNengajo', chainId }),
    abi: PublicNengajoABI.abi,
    eventName: 'Mint',
    listener: (minter: string, tokenId: BigNumber) => {
      if (minter === address && tokenId.toNumber() === 1) {
        setIsLoading(false)
        setSuccess(true)
      }
    }
  })

  const sendMetaTx = useCallback(async () => {
    try {
      if (!signer || !nengajoContract) return
      setIsLoading(true)

      const forwarder = new ethers.Contract(
        getContractAddress({ name: 'podcastForwarder', chainId }),
        FowarderABI.abi,
        signer
      )

      const from = await signer.getAddress()
      const data = nengajoContract.interface.encodeFunctionData('mint', [1])
      const to = nengajoContract.address

      if (!signer.provider) throw new Error('Provider is not set')

      const request = await signMetaTxRequest(signer.provider, forwarder, {
        to,
        from,
        data
      })

      const url =
        chainId === 137
          ? 'https://api.defender.openzeppelin.com/autotasks/0cec06e3-e47a-456a-a5d6-b1193b0f7dda/runs/webhook/e3a5ce05-6a18-4ed2-b4e7-c3bce558a4e4/7tqfzp8iopToiXndXLZqpY'
          : 'https://api.defender.openzeppelin.com/autotasks/11185c35-af59-4c6d-9d87-201324dfad04/runs/webhook/e476306f-6332-4741-bb96-fec21684480a/PqjvD3rf76UeS17gk1iEWB'

      const { data: resData } = await axios.post(url, request)
      if (resData.status === 'error') {
        throw resData
      }
      return
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }, [signer, chainId])

  return { sendMetaTx, isLoading, isSuccess }
}

const useNengajoContractRead = (functionName: string, args: unknown[] = []) => {
  const result = useContractRead({
    address: getContractAddress({ name: 'podcastNengajo', chainId }),
    abi: PublicNengajoABI.abi,
    functionName,
    args
  })
  return result
}

export const useCurrentSupply = () => {
  const { data, isError, isLoading } = useNengajoContractRead('totalSupply', [
    1
  ]) as { data: BigNumber; isLoading: boolean; isError: boolean }

  return { data, isError, isLoading }
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
