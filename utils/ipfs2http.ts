export const parseIpfs2Pinata = (ipfsURI?: string) => {
  if (!ipfsURI) return ''
  const rootCid = ipfsURI.split('ipfs://')[1]
  return `https://gateway.pinata.cloud/ipfs/${rootCid}`
}
