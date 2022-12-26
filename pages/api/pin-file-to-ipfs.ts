import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { Readable } from 'stream'
import FormData from 'form-data'

type PinResponseData = {
  status: string
  IpfsHash?: string
  error?: string
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb'
    }
  }
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<PinResponseData>
) => {
  try {
    if (req.method !== 'POST') {
      res
        .status(405)
        .json({ status: 'error', error: `'${req.method}' method not allowed` })
    }

    const buffer = Buffer.from(req.body.data.split('base64,')[1], 'base64')
    const stream = Readable.from(buffer)
    const data = new FormData() as any
    data.append('file', stream, { filename: req.body.filename })

    const resFile = await axios.post(
      `${process.env.IPFS_API_ENDPOINT!}/pinning/pinFileToIPFS`,
      data,
      {
        maxBodyLength: 'Infinity' as any,
        headers: {
          pinata_api_key: process.env.IPFS_API_KEY!,
          pinata_secret_api_key: process.env.IPFS_API_SECRET!,
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`
        }
      }
    )
    resFile.data.IpfsHash
    res.status(200).json({
      status: 'success',
      IpfsHash: resFile.data.IpfsHash
    })
  } catch (error: any) {
    res.status(500).json({ status: 'failed', error })
  }
}
export default handler
