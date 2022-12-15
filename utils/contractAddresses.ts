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
    [chainId.polygonMumbai]: '0x22EcFc47666CE823B57F93ef93494d531dfC67Dc',
    [chainId.goerli]: '0x02Dd992774aBCacAD7D46155Da2301854903118D',
    [chainId.polygon]: '0x0cc91a5FFC2E9370eC565Ab42ECE33bbC08C11a2'
  },
  nengajo: {
    [chainId.hardhat]:
      (process.env.NEXT_PUBLIC_CONTRACT_NENGAJO_ADDRESS as `0x${string}`) ?? '',
    [chainId.polygonMumbai]: '0x6685B17A72070e76caB501224A305499220FE9eC',
    // added Badge contract just to test approval
    [chainId.goerli]: '0x6beD9e854eC468373B70a00d864E660b9F224D32',
    // added Badge contract just to test approval
    [chainId.polygon]: '0x2C3530B4642ff8fCEb6ab5Fc740381a358968aF1'
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
