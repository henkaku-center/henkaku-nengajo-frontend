import { BigNumber, ethers } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import FowarderABI from '@/abi/Forwarder.json'
import PublicNengajoABI from '@/abi/PublicNengajo.json'
import { signMetaTxRequest } from '@/utils/signer'
import {
  useAccount,
  useContract,
  useContractEvent,
  useContractRead,
  useSigner
} from 'wagmi'

const PUBLIC_NENGAJO_ADDRESS = '0x014122281213bCc1CD6f2eB9b9F9e0d199Db070F'
const FORWARDER_ADDRESS = '0x6470a42b6eF513d7A7A57741421E9154612c31E2'
const AUTOTASK_WEBHOOK_URL =
  'https://api.defender.openzeppelin.com/autotasks/11185c35-af59-4c6d-9d87-201324dfad04/runs/webhook/e476306f-6332-4741-bb96-fec21684480a/PqjvD3rf76UeS17gk1iEWB'

export const useMintNengajoWithMx = () => {
  const { data: signer } = useSigner()
  const nengajoContract = useContract({
    address: PUBLIC_NENGAJO_ADDRESS,
    abi: PublicNengajoABI.abi
  })
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setSuccess] = useState(false)

  useContractEvent({
    address: PUBLIC_NENGAJO_ADDRESS,
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
        FORWARDER_ADDRESS,
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

      return fetch(AUTOTASK_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }, [signer])

  return { sendMetaTx, isLoading, isSuccess }
}

const useNengajoContractRead = (functionName: string, args: unknown[] = []) => {
  const result = useContractRead({
    address: PUBLIC_NENGAJO_ADDRESS,
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
