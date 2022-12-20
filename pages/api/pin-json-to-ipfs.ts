import type { NextApiRequest, NextApiResponse } from 'next'

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
  let status = 200
  let resultBody = {
    status: 'success',
    IpfsHash: 'QmW4ye3Xw8kTkXust7dbautvVtELPtyHFVQBkP5NLaQRVq'
    // TODO: actually pin to IPFS instead returning a placeholder hash
  }
  res.status(status).json(resultBody)
}
export default handler
