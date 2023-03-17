import { useEffect, useState } from 'react'
import { Nengajo } from '@/types'
import { parseIpfs2Pinata } from '@/utils/ipfs2http'

interface TicketInfoProps extends Nengajo.NengajoInfoStruct {
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

const mappingTicketInfo = async ({
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
  } as TicketInfoProps
}

const fetchTokenURIJSON = async (uri: string) => {
  try {
    const res = await fetch(uri)
    const data = await res.json()
    return data
  } catch (error) {}
}

const useTicketInfo = (item: Nengajo.NengajoInfoStructOutput) => {
  const [ticketInfo, setTicketInfo] = useState<TicketInfoProps>()
  useEffect(() => {
    const fetchTicketInfo = async () => {
      if (!item) return
      const mappedData = await mappingTicketInfo(item)
      return mappedData
    }
    fetchTicketInfo().then((data) => setTicketInfo(data))
  }, [item])
  return { ticketInfo }
}

const useAllTicketsInfo = (items: Nengajo.NengajoInfoStructOutput[]) => {
  const [allTicketsInfo, setAllTicketsInfo] = useState<TicketInfoProps[]>()
  useEffect(() => {
    const fetchAllTicketsInfo = async () => {
      if (!items) return
      const mappedData = await Promise.all(
        items.map(async (item) => {
          return await mappingTicketInfo(item)
        })
      )
      return mappedData.reverse()
    }
    fetchAllTicketsInfo().then((data) => setAllTicketsInfo(data))
  }, [items])
  return { allTicketsInfo }
}

export { useTicketInfo, useAllTicketsInfo }
export type { TicketInfoProps }
