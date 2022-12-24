export const parseIpfs2Pinata = (ipfsURI?: string) => {
  if (!ipfsURI) return ''
  const rootCid = ipfsURI.split('ipfs://')[1]
  return `${
    process.env.NEXT_PUBLIC_IPFS_GATEWAY_BASEURL ||
    'https://gateway.pinata.cloud'
  }/ipfs/${rootCid}`
}
