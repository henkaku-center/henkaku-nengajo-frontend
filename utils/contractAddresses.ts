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
    [chainId.localhost]:
      process.env.NEXT_PUBLIC_CONTRACT_HENKAKUV2_ADDRESS ?? '',
    [chainId.goerli]: '0x02Dd992774aBCacAD7D46155Da2301854903118D',
    [chainId.polygon]: '0x0cc91a5FFC2E9370eC565Ab42ECE33bbC08C11a2'
  },
  nengajo: {
    [chainId.localhost]: process.env.NEXT_PUBLIC_CONTRACT_NENGAJO_ADDRESS ?? '',
    // added koukan contract just to test approval
    [chainId.goerli]: '0xee7Aea6F80378536998a642f924ccaC31F1c3C59'
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
