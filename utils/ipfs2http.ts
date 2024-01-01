export const parseIpfs2Pinata = (ipfsURI?: string) => {
  if (!ipfsURI) return ''
  const rootCid = ipfsURI.split('ipfs://')[1]
  return `https://${
    process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud'
  }/ipfs/${rootCid}`
}
