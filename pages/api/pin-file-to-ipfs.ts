import type { NextApiRequest, NextApiResponse } from 'next'

type PinResponseData = {
  status: string
  data?: {
    IpfsHash?: string
  }
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

  let status = 200
  let resultBody: PinResponseData = {
    status: 'success',
    data: { IpfsHash: 'Qmb9iRztDn3uTu7VcpXo9tNXatYAJahGz3AWSkL2q7iYne' }
    // TODO: actually pin to IPFS instead returning a placeholder hash
  }
  })
  res.status(status).json(resultBody)
}

export default handler
