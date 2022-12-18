import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  status: string
  IpfsHash?: string
  error?: string
}
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    res.status(200).json({
      status: 'success',
      IpfsHash: 'QmW4ye3Xw8kTkXust7dbautvVtELPtyHFVQBkP5NLaQRVq'
      // TODO: actually pin to IPFS instead returning a placeholder hash
    })
  } else {
    res
      .status(405)
      .json({ status: 'error', error: `'${req.method}' method not allowed` })
  }
}
