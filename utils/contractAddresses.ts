import { chainId } from 'wagmi'

interface ContractAddresses {
  [name: string]: {
    [chainId: number]: string
  }
}

interface getContractAddressArg {
  name: keyof ContractAddresses
  chainId: number | undefined
}

const contractAddresses: ContractAddresses = {
  henkakuErc20: {
    [chainId.hardhat]:
      (process.env.NEXT_PUBLIC_CONTRACT_HENKAKUV2_ADDRESS as `0x${string}`) ??
      '',
    [chainId.polygonMumbai]: '0x069cc1413525a0bA0E40aAAee38D5a1DB05C9cB4',
    [chainId.goerli]: '0x02Dd992774aBCacAD7D46155Da2301854903118D',
    [chainId.polygon]: '0x0cc91a5FFC2E9370eC565Ab42ECE33bbC08C11a2'
  },
  nengajo: {
    [chainId.hardhat]:
      (process.env.NEXT_PUBLIC_CONTRACT_NENGAJO_ADDRESS as `0x${string}`) ?? '',
    [chainId.polygonMumbai]: '0xaF0b91F9aC1fC03A07203b1Bb3f395dEb555A8AE',
    [chainId.goerli]: '0x6beD9e854eC468373B70a00d864E660b9F224D32',
    [chainId.polygon]: '0x06032956f2E35b6Fa43C9e75fA3c55A1E1AF8917'
  }
}

const defaultChainID = process.env.production ? chainId.polygon : chainId.goerli

const getContractAddress = ({ name, chainId }: getContractAddressArg) => {
  return contractAddresses[name][chainId || defaultChainID]
}

export {
  contractAddresses as contractAddresses,
  defaultChainID,
  getContractAddress
}
