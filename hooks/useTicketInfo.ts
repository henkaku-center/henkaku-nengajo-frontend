import { useEffect, useState } from 'react'
import { Ticket } from '@/types'
import { parseIpfs2Pinata } from '@/utils/ipfs2http'

interface TicketInfoProps extends Ticket.TicketInfoStruct {
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
}: Ticket.TicketInfoStructOutput) => {
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

const useTicketInfo = (item: Ticket.TicketInfoStructOutput) => {
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

const useAllTicketsInfo = (items: Ticket.TicketInfoStructOutput[]) => {
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
