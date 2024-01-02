import Link from 'next/link'
import React from 'react'
import {
  Box,
  Button,
  Image,
  AspectRatio,
  Text,
  SimpleGrid,
  Spinner,
  Stack
} from '@chakra-ui/react'
import { Omamori } from '@/types'
import { useAllOmamoriesInfo } from '@/hooks/useOmamoriInfo'
import styles from './OmamoriesList.module.css'
import useTranslation from 'next-translate/useTranslation'
import { parseIpfs2Pinata } from '@/utils/ipfs2http'
import { useRetrieveHoldingOmamorisByAddress } from '@/hooks/useOmamoriContract'
import { useAccount } from 'wagmi'
import Naifu from '../Naifu'

interface OmamoriesListProps {
  items: Omamori.NengajoInfoStructOutput[]
}

const OmamoriesList: React.FC<OmamoriesListProps> = ({ items }) => {
  const { allOmamoriesInfo } = useAllOmamoriesInfo(items)
  const { address } = useAccount()
  const { data: mintedOmamories } = useRetrieveHoldingOmamorisByAddress(
    address ?? ''
  )
  const { t } = useTranslation('common')
  const { t: o } = useTranslation('omamori')

  if (!allOmamoriesInfo)
    return (
      <Stack direction="row" justifyContent="center" alignItems="center" m={10}>
        <Spinner />
      </Stack>
    )
  if (allOmamoriesInfo.length <= 0) return <Box>{t('EMPTY_NENGAJO_LIST')}</Box>
  return (
    <SimpleGrid
      columns={{ sm: 3, md: 4 }}
      spacing="30px"
      p="0"
      textAlign="center"
      rounded="lg"
    >
      {allOmamoriesInfo.map((omamoriInfo, index) => {
        if (!omamoriInfo.tokenURIJSON) return
        const minted = mintedOmamories?.some(
          (mintedOmamori) => mintedOmamori.id === omamoriInfo.id
        )
        return (
          <div key={index} className={styles.list}>
            <div className={styles.image}>
              <Link href={`/omamori/${omamoriInfo.id}`}>
                <AspectRatio ratio={1}>
                  <Box>
                    {minted ? (
                      <Image
                        src={parseIpfs2Pinata(omamoriInfo.tokenURIJSON.image)}
                        alt=""
                      />
                    ) : (
                      <Naifu id={Number(omamoriInfo?.id)} size="thumb" />
                    )}
                  </Box>
                </AspectRatio>
              </Link>
            </div>
            <Text pt={2} pb={2} m="auto" textAlign="left">
              {minted ? o('OMAMORI') : o('NAIFU')}「
              {omamoriInfo.tokenURIJSON.name}」
            </Text>
            <Link href={`/omamori/${omamoriInfo.id}`}>
              <Button width="100%" size="sm" colorScheme="purple">
                {o('GET_OMAMORI')}
              </Button>
            </Link>
          </div>
        )
      })}
    </SimpleGrid>
  )
}

export default OmamoriesList
