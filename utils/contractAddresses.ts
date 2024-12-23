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

const holeskyChainId = 17000

const contractAddresses: ContractAddresses = {
  henkakuErc20: {
    [chainId.hardhat]:
      (process.env.NEXT_PUBLIC_CONTRACT_HENKAKUV2_ADDRESS as `0x${string}`) ??
      '',
    [chainId.polygonMumbai]: '0x2682e963DA4e92A59062e550843d01a4B189cF92',
    // [chainId.goerli]: '0x02Dd992774aBCacAD7D46155Da2301854903118D',
    [chainId.polygon]: '0x0cc91a5FFC2E9370eC565Ab42ECE33bbC08C11a2',
    [holeskyChainId]: '0x0000000000000000000000000000000000000000'
  },
  nengajo: {
    [chainId.hardhat]:
      (process.env.NEXT_PUBLIC_CONTRACT_NENGAJO_ADDRESS as `0x${string}`) ?? '',
    [chainId.polygonMumbai]: '0x6aDbE62B4D7A8fA01705f74b2a27e5Cc6b998394',
    // [chainId.goerli]: '0x6beD9e854eC468373B70a00d864E660b9F224D32',
    [chainId.polygon]: '0x4711313De918B66661fC826497e228526Cbc1067',
    [holeskyChainId]: '0x0000000000000000000000000000000000000000'
  },
  Forwarder: {
    [chainId.hardhat]:
      (process.env.NEXT_PUBLIC_CONTRACT_FORWARDER_ADDRESS as `0x${string}`) ??
      '',
    [chainId.polygonMumbai]: '0xe64B04dBd4933b5F5bfF80d1d7616A908F6DCF08',
    [chainId.polygon]: '0x802422C3cc18ED1f765bb6932Ec9A45cc6A1Fa6E',
    [holeskyChainId]: '0xa7574b47ED70C8E3F8B0A80B4D62C1b76ac3b0A9'
  },
  omamori: {
    [chainId.hardhat]:
      (process.env.NEXT_PUBLIC_CONTRACT_OMAMORI_ADDRESS as `0x${string}`) ?? '',
    [chainId.polygonMumbai]: '0xc5d4f8918491b114bEd4525E6c3D59AcABf7e183',
    [chainId.polygon]: '0xAC42aA54DfF142b5cEB4196B94cc013bbCf074C5',
    [holeskyChainId]: '0x861A1Ba1ff675eFe0b5d755E5E08876851F9E80E'
  },
  omamoriForwarder: {
    [chainId.hardhat]:
      (process.env.NEXT_PUBLIC_CONTRACT_FORWARDER_ADDRESS as `0x${string}`) ??
      '',
    [chainId.polygonMumbai]: '0xe64B04dBd4933b5F5bfF80d1d7616A908F6DCF08',
    [chainId.polygon]: '0x802422C3cc18ED1f765bb6932Ec9A45cc6A1Fa6E',
    [holeskyChainId]: '0xa7574b47ED70C8E3F8B0A80B4D62C1b76ac3b0A9'
  },
  otakiage: {
    [holeskyChainId]: '0xc87D7FE5E5Af9cfEDE29F8d362EEb1a788c539cf'
  }
}

const defaultChainID = process.env.production ? chainId.polygon : holeskyChainId

const getContractAddress = ({ name, chainId }: getContractAddressArg) => {
  return contractAddresses[name][chainId || defaultChainID]
}

export {
  contractAddresses as contractAddresses,
  defaultChainID,
  getContractAddress
}
