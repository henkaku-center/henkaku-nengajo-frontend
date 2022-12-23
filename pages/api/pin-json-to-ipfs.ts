import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

type PinResponseData = {
  status: string
  IpfsHash?: string
  error?: string
}
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<PinResponseData>
) => {
  if (req.method !== 'POST') {
    res
      .status(405)
      .json({ status: 'error', error: `'${req.method}' method not allowed` })
  }

  try {
    const { data } = await axios.post(
      `${process.env.IPFS_API_ENDPOINT!}/pinning/pinJSONToIPFS`,
      req.body,
      {
        headers: {
          pinata_api_key: process.env.IPFS_API_KEY!,
          pinata_secret_api_key: process.env.IPFS_API_SECRET!
        }
      }
    )

    let resultBody = {
      status: 'success',
      IpfsHash: data.IpfsHash
    }
    res.status(200).json(resultBody)
  } catch (error: any) {
    res.status(500).json({ status: 'failed', error })
  }
}
export default handler
