import { BigNumber, ethers } from 'ethers'
import { useState } from 'react'
import {
  erc20ABI,
  useContractRead,
  useContractWrite,
  useContractEvent,
  usePrepareContractWrite
} from 'wagmi'

const APPROVE_CALLBACK_STATUS = {
  PENDING: 1,
  FAIL: 2,
  FINISH: 3
}

const useApprove = (erc20: string, spender: string) => {
  const [status, setStatus] = useState<number>()
  const { config } = usePrepareContractWrite({
    address: erc20,
    abi: erc20ABI,
    functionName: 'approve',
    args: [spender as `0x${string}`, ethers.constants.MaxUint256]
  })

  const { write: contractApprove } = useContractWrite({
    ...config,
    onError(error) {
      console.log('approve ERROR:', error)
      setStatus(APPROVE_CALLBACK_STATUS.FAIL)
    },
    onSuccess(data) {
      console.log('approve SUCCESS:', data)
      setStatus(APPROVE_CALLBACK_STATUS.PENDING)
    }
  })

  return {
    status: status,
    approve: () => contractApprove?.()
  }
}

const useApproval = (
  erc20: string,
  spenderAddress: string,
  address: string | undefined
) => {
  const [approved, setApprove] = useState<boolean>()
  const [allowanceValue, setAllowanceValue] = useState<BigNumber>()

  useContractRead({
    address: erc20,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [
      (address as `0x${string}`) || ethers.constants.AddressZero,
      spenderAddress as `0x${string}`
    ],
    onSuccess(data) {
      setApprove(data?.gt(1000) ? true : false)
    }
  })

  try {
    useContractEvent({
      address: erc20,
      abi: erc20ABI,
      eventName: 'Approval',
      listener(owner, eventAddress, value) {
        if (owner == address && eventAddress == spenderAddress) {
          setApprove(value?.gt(1000) ? true : false)
          setAllowanceValue(value)
        }
      }
    })
  } catch (e: any) {
    console.error(e) // with different chain it occurs
    if (e?.code != ethers.errors.INVALID_ARGUMENT) {
      throw e
    }
  }

  return {
    approved,
    allowanceValue
  }
}

export { useApproval, useApprove, APPROVE_CALLBACK_STATUS }
