import type { NextPage } from 'next'
import { SimpleGrid } from '@chakra-ui/react'
import Layout from '@/components/Layout'
import React, { useMemo } from 'react'
import TicketsList from '@/components/TicketsList'
import { useRetrieveAllTicket } from '@/hooks/useTicketContract'
import { HIDE_TICKET_LIST } from '@/constants/Ticket'

const Lists: NextPage = () => {
  const { data } = useRetrieveAllTicket()
  const filteredTicket = useMemo(() => {
    return data?.filter((n) => !HIDE_TICKET_LIST.includes(n.id.toNumber()))
  }, [data])

  return (
    <Layout>
      <SimpleGrid
        columns={{ sm: 3, md: 4 }}
        spacing="30px"
        p="0"
        minChildWidth="150px"
        textAlign="center"
        rounded="lg"
      >
        {filteredTicket && <TicketsList items={data} />}
      </SimpleGrid>
    </Layout>
  )
}

export default Lists
