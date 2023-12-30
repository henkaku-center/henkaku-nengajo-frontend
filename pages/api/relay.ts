import { NextApiRequest, NextApiResponse } from 'next'
import { developmentSigner, ozSigner } from './utils/relayer'
import { Contract } from 'ethers'
import ZCAForwarderABI from '@/abi/Forwarder.json'
import { Forwarder } from '@/types'
import {
  contractAddresses,
  getContractAddress
} from '@/utils/contractAddresses'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Private-Network', 'true')

  const relayerSigner = process.env.DEVELOPMENT_RELAYER_PRIVATE_KEY
    ? developmentSigner()
    : ozSigner()

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  if (req.method !== 'POST') res.status(404).end()

  try {
    const { request, signature } = req.body

    const forwarderAddress = getContractAddress({
      name: 'Forwarder',
      chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID)
    })

    const forwarder: Forwarder = new Contract(
      forwarderAddress,
      ZCAForwarderABI.abi,
      relayerSigner
    ) as any

    const valid = await forwarder.verify(request, signature)

    if (!valid) throw new Error('invalid signature')

    const tx = await forwarder.execute(request, signature)

    res.status(200).json({ tx: tx })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}
