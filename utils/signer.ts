import { ethers } from 'ethers'
import ethSignUtil from 'eth-sig-util'
import { getContractAddress } from '@/utils/contractAddresses'
import ForwarderABI from '@/abi/Forwarder.json'

// definistion of domainSeparator
// https://eips.ethereum.org/EIPS/eip-712
const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' }
]

// forwarder request struct
// ref: lib/openzeppelin-contracts/contracts/metatx/MinimalForwarder.sol
const ForwardRequest = [
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'gas', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'data', type: 'bytes' }
]

const getMetaTxTypeData = (chainId: number, verifyingContract: string) => {
  // Specification of the eth_signTypedData JSON RPC
  return {
    types: {
      EIP712Domain,
      ForwardRequest
    },
    domain: {
      name: 'Forwarder',
      version: '0.0.1',
      chainId,
      verifyingContract
    },
    primaryType: 'ForwardRequest'
  }
}

// TODO: do not use any type
const signTypeData = async (signer: any, from: string, data: any) => {
  // if signer is a private key, use it to sign
  if (typeof signer === 'string') {
    const privateKey = Buffer.from(signer.replace(/^0x/, ''), 'hex')
    return ethSignUtil.signTypedMessage(privateKey, { data })
  }

  // Otherwise, send the signTypedData RPC call
  const [method, argData] = ['eth_signTypedData_v4', JSON.stringify(data)]
  return await signer.send(method, [from, argData])
}

export const buildRequest = async (forwarder: ethers.Contract, input: any) => {
  console.log('buildRequest start')
  console.log('入力値:', input)

  try {
    // forwarderコントラクトの状態確認
    console.log('Forwarderアドレス:', forwarder.address)
    console.log('Provider:', forwarder.provider)

    // nonceの取得（BigNumber型で返される）
    const nonce = await forwarder.getNonce(input.from)
    console.log('取得したnonce:', nonce.toString())

    return {
      value: 0,
      gas: 1e6,
      nonce: nonce.toString(), // BigNumberを文字列に変換
      ...input
    }
  } catch (error) {
    // エラー情報の詳細なログ
    console.error('buildRequestでエラー発生:', {
      error,
      forwarderAddress: forwarder.address,
      fromAddress: input.from,
      providerNetwork: await forwarder.provider
        .getNetwork()
        .catch(() => 'unknown')
    })
    throw error
  }
}

export const buildTypedData = async (
  forwarder: ethers.Contract,
  request: any
) => {
  const chainId = await forwarder.provider.getNetwork().then((n) => n.chainId)
  const typeData = getMetaTxTypeData(chainId, forwarder.address)
  return { ...typeData, message: request }
}

export const signMetaTxRequest = async (
  signer: any,
  forwarder: ethers.Contract,
  input: any
) => {
  console.log('signMetaTxRequest start')
  const request = await buildRequest(forwarder, input)
  console.log('signMetaTxRequest 0')
  const toSign = await buildTypedData(forwarder, request)
  console.log('signMetaTxRequest 1')
  const signature = await signTypeData(signer, input.from, toSign)
  console.log('signMetaTxRequest end')
  return { signature, request }
}
