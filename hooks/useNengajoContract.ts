import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite
} from 'wagmi'
import { getContractAddress } from '@/utils/contractAddresses'
import NengajoABI from '@/abi/Nengajo.json'
import { Nengajo } from '@/types'

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

export const useRegisterNengajo = () => {
  const config = usePrepareNengajoContractWrite('registerNengajo')
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)

  return { data, isLoading, isSuccess, writeAsync }
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
