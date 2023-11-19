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
    [chainId.polygonMumbai]: '0x095F411f6759Fa8C088327399293eCc9a0E35fbb',
    // [chainId.goerli]: '0x02Dd992774aBCacAD7D46155Da2301854903118D',
    [chainId.polygon]: '0x0cc91a5FFC2E9370eC565Ab42ECE33bbC08C11a2'
  },
  nengajo: {
    [chainId.hardhat]:
      (process.env.NEXT_PUBLIC_CONTRACT_NENGAJO_ADDRESS as `0x${string}`) ?? '',
    [chainId.polygonMumbai]: '0x7F87F4EC0F78e72E9A4a5a93EA6e98c1Cf23E41f',
    // [chainId.goerli]: '0x6beD9e854eC468373B70a00d864E660b9F224D32',
    [chainId.polygon]: '0x06032956f2E35b6Fa43C9e75fA3c55A1E1AF8917'
  },
  podcastNengajo: {
    [chainId.polygonMumbai]: '0x3F359Ec705F25a9D287EdDc5370b57e20C237c1E',
    [chainId.polygon]: '0xd6Bf2bb451458A308B53A8c02F1beC638BbcCA10'
  },
  podcastForwarder: {
    [chainId.polygonMumbai]: '0xd68752aE770Bc2852480eb41669018727680C3C3',
    [chainId.polygon]: '0xFe6989B0db606E52e22c7a0Eaf63cf179aEAAAaC'
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
