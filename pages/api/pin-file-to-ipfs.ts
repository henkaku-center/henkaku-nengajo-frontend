import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  status: string
  data?: {
    IpfsHash?: string
  }
  error?: string
}
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    res.status(200).json({
      status: 'success',
      data: { IpfsHash: 'Qmb9iRztDn3uTu7VcpXo9tNXatYAJahGz3AWSkL2q7iYne' }
      // TODO: actually pin to IPFS instead returning a placeholder hash
    })
  } else {
    res
      .status(405)
      .json({ status: 'error', error: `'${req.method}' method not allowed` })
  }
}
