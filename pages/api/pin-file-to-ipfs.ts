import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

type PinResponseData = {
  status: string
  data?: {
    IpfsHash?: string
  }
  error?: string
}
const IPFS_API_KEY = process.env.NEXT_PUBLIC_IPFS_API_KEY
const IPFS_API_SECRET = process.env.NEXT_PUBLIC_IPFS_API_SECRET
const IPFS_API_ENDPOINT = process.env.NEXT_PUBLIC_IPFS_API_ENDPOINT

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<PinResponseData>
) => {
  if (req.method !== 'POST') {
    res
      .status(405)
      .json({ status: 'error', error: `'${req.method}' method not allowed` })
  }

  const resFile = await axios({
    method: 'post',
    url: IPFS_API_ENDPOINT + '/pinning/pinFileToIPFS',
    data: req.body,
    headers: {
      pinata_api_key: `${IPFS_API_KEY}`,
      pinata_secret_api_key: `${IPFS_API_SECRET}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  console.log(resFile)
  resFile.data.IpfsHash
  let status = 200
  let resultBody: PinResponseData = {
    status: 'success',
    data: { IpfsHash: resFile.data.IpfsHash }
  }

  res.status(status).json(resultBody)
}
export default handler
