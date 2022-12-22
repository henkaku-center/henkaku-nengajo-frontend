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
import { useAllNengajoesInfo } from '@/hooks/useNengajoInfo'
// Cart機能が実装された際に利用する
// import { PreviewNengajo } from '@/components/MintNengajo'
// import { Search2Icon } from '@chakra-ui/icons'
import styles from './NengajoesList.module.css'
import useTranslation from 'next-translate/useTranslation'
import { parseIpfs2Pinata } from '@/utils/ipfs2http'

interface NengajoesListProps {
  items: Nengajo.NengajoInfoStructOutput[]
}

const NengajoesList: React.FC<NengajoesListProps> = ({ items }) => {
  const { allNengajoesInfo } = useAllNengajoesInfo(items)
  const { t } = useTranslation('common')

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
            <div className={styles.list}>
              <div className={styles.image}>
                <Link href={`/nengajo/${nengajoInfo.id}`}>
                  <AspectRatio ratio={1}>
                    <Box>
                      <Image
                        src={parseIpfs2Pinata(nengajoInfo.tokenURIJSON.image)}
                        alt=""
                      />
                    </Box>
                  </AspectRatio>
                </Link>
              </div>
              <Text pt={2} pb={2} mb="auto">
                {nengajoInfo.tokenURIJSON.name}
              </Text>
              <Link href={`/nengajo/${nengajoInfo.id}`}>
                <Button width="100%">{t('GET_NENGAJO')}</Button>
              </Link>
              {/* <div className={styles.preview}>
                <PreviewNengajo id={Number(nengajoInfo.id)} item={nengajoInfo}>
                  <Search2Icon color="blackAlpha.700" />
                </PreviewNengajo>
              </div> */}
            </div>
          </Flex>
        )
      })}
    </SimpleGrid>
  )
}

export default NengajoesList
