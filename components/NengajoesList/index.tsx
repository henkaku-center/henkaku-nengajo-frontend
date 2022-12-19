import Link from 'next/link'
import React from 'react'
import {
  Box,
  Button,
  Image,
  AspectRatio,
  Text,
  Flex,
  SimpleGrid
} from '@chakra-ui/react'
import { Nengajo } from '@/types'
import { PreviewNengajo } from '@/components/MintNengajo'
import { useAllNengajoesInfo } from '@/hooks/useNengajoInfo'

interface NengajoesListProps {
  items: Nengajo.NengajoInfoStructOutput[]
}

const NengajoesList: React.FC<NengajoesListProps> = ({ items }) => {
  const { allNengajoesInfo } = useAllNengajoesInfo(items)

  if (!allNengajoesInfo || allNengajoesInfo.length <= 0) return <></>
  return (
    <SimpleGrid
      columns={{ sm: 3, md: 4 }}
      spacing="30px"
      p="0"
      textAlign="center"
      rounded="lg"
    >
      {allNengajoesInfo.map((nengajoInfo, index) => {
        if (!nengajoInfo.tokenURIJSON) return
        return (
          <Flex
            key={index}
            justifyContent="space-between"
            flexDirection="column"
          >
            <PreviewNengajo item={nengajoInfo}>
              <AspectRatio ratio={1}>
                <Box>
                  <Image src={nengajoInfo.tokenURIJSON.image} alt="" />
                </Box>
              </AspectRatio>
            </PreviewNengajo>
            <Text pt={2} pb={2} mb="auto">
              {nengajoInfo.tokenURIJSON.name}
            </Text>
            <Link href={`/nengajo/${nengajoInfo.id}`}>
              <Button width="100%">Get Nengajo</Button>
            </Link>
          </Flex>
        )
      })}
    </SimpleGrid>
  )
}

export default NengajoesList
