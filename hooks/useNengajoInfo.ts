import { useEffect, useState } from 'react'
import { Nengajo } from '@/types'
import { parseIpfs2Pinata } from '@/utils/ipfs2http'

interface NengajoInfoProps extends Nengajo.NengajoInfoStruct {
  tokenURIJSON: {
    name: string
    image: string
    external_url: string
    description: string
    encryptedFile?: string
    encryptedSymmetricKey?: string
    attributes: Object
  }
}

const mappingNengajoInfo = async ({
  uri,
  creator,
  id,
  maxSupply
}: Nengajo.NengajoInfoStructOutput) => {
  const pinataGatewayURI = parseIpfs2Pinata(uri)
  const tokenURIJSON = await fetchTokenURIJSON(pinataGatewayURI)
  return {
    uri: uri,
    creator: creator,
    id: Number(id),
    maxSupply: maxSupply,
    tokenURIJSON
  } as NengajoInfoProps
}

const fetchTokenURIJSON = async (uri: string) => {
  try {
    const res = await fetch(uri)
    const data = await res.json()
    return data
  } catch (error) {}
}

const useNengajoInfo = (item: Nengajo.NengajoInfoStructOutput) => {
  const [nengajoInfo, setNengajoInfo] = useState<NengajoInfoProps>()
  useEffect(() => {
    const fetchNengajoInfo = async () => {
      if (!item) return
      const mappedData = await mappingNengajoInfo(item)
      return mappedData
    }
    fetchNengajoInfo().then((data) => setNengajoInfo(data))
  }, [item])
  return { nengajoInfo }
}

const useAllNengajoesInfo = (items: Nengajo.NengajoInfoStructOutput[]) => {
  const [allNengajoesInfo, setAllNengajoesInfo] = useState<NengajoInfoProps[]>()
  useEffect(() => {
    const fetchAllNengajoesInfo = async () => {
      if (!items) return
      const mappedData = await Promise.all(
        items.map(async (item) => {
          return await mappingNengajoInfo(item)
        })
      )
      return mappedData
    }
    fetchAllNengajoesInfo().then((data) => setAllNengajoesInfo(data))
  }, [items])
  return { allNengajoesInfo }
}

export { useNengajoInfo, useAllNengajoesInfo }
export type { NengajoInfoProps }
