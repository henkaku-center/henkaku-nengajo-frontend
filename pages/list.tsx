import type { NextPage } from 'next'
import { SimpleGrid } from '@chakra-ui/react'
import Layout from '@/components/Layout'
import React from 'react'
import NengajoesList from '@/components/NengajoesList'
import { useRetrieveAllNengajo } from '@/hooks/useNengajoContract'

const Lists: NextPage = () => {
  const { data } = useRetrieveAllNengajo()
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
        {data && <NengajoesList items={data} />}
      </SimpleGrid>
    </Layout>
  )
}

export default Lists
