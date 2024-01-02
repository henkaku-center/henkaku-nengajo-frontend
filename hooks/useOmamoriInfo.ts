import { useEffect, useState } from 'react'
import { Omamori } from '@/types'
import { parseIpfs2Pinata } from '@/utils/ipfs2http'

interface OmamoriInfoProps extends Omamori.NengajoInfoStruct {
  tokenURIJSON: {
    name: string
    image: string
    external_url: string
    description: string
    encryptedFile?: string
    encryptedSymmetricKey?: string
    attributes: { trait_type: string; value: string }[]
  }
}

const mappingOmamoriInfo = async ({
  uri,
  creator,
  id,
  maxSupply
}: Omamori.NengajoInfoStructOutput) => {
  const pinataGatewayURI = parseIpfs2Pinata(uri)
  const tokenURIJSON = await fetchTokenURIJSON(pinataGatewayURI)
  return {
    uri: uri,
    creator: creator,
    id: Number(id),
    maxSupply: maxSupply,
    tokenURIJSON
  } as OmamoriInfoProps
}

const fetchTokenURIJSON = async (uri: string) => {
  try {
    const res = await fetch(uri)
    const data = await res.json()
    return data
  } catch (error) {}
}

const useOmamoriInfo = (item: Omamori.NengajoInfoStructOutput) => {
  const [omamoriInfo, setOmamoriInfo] = useState<OmamoriInfoProps>()
  useEffect(() => {
    const fetchOmamoriInfo = async () => {
      if (!item) return
      const mappedData = await mappingOmamoriInfo(item)
      return mappedData
    }
    fetchOmamoriInfo().then((data) => setOmamoriInfo(data))
  }, [item])
  return { omamoriInfo }
}

const useAllOmamoriesInfo = (items: Omamori.NengajoInfoStructOutput[]) => {
  const [allOmamoriesInfo, setAllOmamoriesInfo] = useState<OmamoriInfoProps[]>()
  useEffect(() => {
    const fetchAllOmamoriesInfo = async () => {
      if (!items) return
      const mappedData = await Promise.all(
        items.map(async (item) => {
          return await mappingOmamoriInfo(item)
        })
      )
      return mappedData.reverse()
    }
    fetchAllOmamoriesInfo().then((data) => setAllOmamoriesInfo(data))
  }, [items])
  return { allOmamoriesInfo }
}

export { useOmamoriInfo, useAllOmamoriesInfo }
export type { OmamoriInfoProps }
