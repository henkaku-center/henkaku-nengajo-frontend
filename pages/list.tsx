import type { NextPage } from 'next'
import { SimpleGrid } from '@chakra-ui/react'
import Layout from '@/components/Layout'
import React, { useMemo } from 'react'
import NengajoesList from '@/components/NengajoesList'
import { useRetrieveAllNengajo } from '@/hooks/useNengajoContract'
import { HIDE_NENGAJO_LIST } from '@/constants/Nengajo'

const Lists: NextPage = () => {
  const { data } = useRetrieveAllNengajo()
  const filteredNengajo = useMemo(() => {
    return data?.filter((n) => !HIDE_NENGAJO_LIST.includes(n.id.toNumber()))
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
        {filteredNengajo && <NengajoesList items={data} />}
      </SimpleGrid>
    </Layout>
  )
}

export default Lists
