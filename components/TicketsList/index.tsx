import Link from 'next/link'
import React from 'react'
import {
  Box,
  Button,
  Image,
  AspectRatio,
  Text,
  Flex,
  SimpleGrid,
  Spinner,
  Stack
} from '@chakra-ui/react'
import { Nengajo } from '@/types'
import { useAllTicketsInfo } from '@/hooks/useTicketInfo'
// Cart機能が実装された際に利用する
// import { PreviewTicket } from '@/components/MintTicket'
// import { Search2Icon } from '@chakra-ui/icons'
import styles from './TicketsList.module.css'
import useTranslation from 'next-translate/useTranslation'
import { parseIpfs2Pinata } from '@/utils/ipfs2http'

interface TicketsListProps {
  items: Nengajo.NengajoInfoStructOutput[]
}

const TicketsList: React.FC<TicketsListProps> = ({ items }) => {
  const { allTicketsInfo } = useAllTicketsInfo(items)
  const { t } = useTranslation('common')

  if (!allTicketsInfo)
    return (
      <Stack direction="row" justifyContent="center" alignItems="center" m={10}>
        <Spinner />
      </Stack>
    )
  if (allTicketsInfo.length <= 0) return <Box>{t('EMPTY_TICKET_LIST')}</Box>
  return (
    <SimpleGrid
      columns={{ sm: 3, md: 4 }}
      spacing="30px"
      p="0"
      textAlign="center"
      rounded="lg"
    >
      {allTicketsInfo.map((ticketInfo, index) => {
        if (!ticketInfo.tokenURIJSON) return
        return (
          <div key={index} className={styles.list}>
            <div className={styles.image}>
              <Link href={`/ticket/${ticketInfo.id}`}>
                <AspectRatio ratio={1}>
                  <Box>
                    <Image
                      src={parseIpfs2Pinata(ticketInfo.tokenURIJSON.image)}
                      alt=""
                    />
                  </Box>
                </AspectRatio>
              </Link>
            </div>
            <Text pt={2} pb={2} mb="auto">
              {ticketInfo.tokenURIJSON.name}
            </Text>
            <Link href={`/ticket/${ticketInfo.id}`}>
              <Button width="100%" size="sm">
                {t('GET_TICKET')}
              </Button>
            </Link>
            {/* <div className={styles.preview}>
                <PreviewTicket id={Number(ticketInfo.id)} item={ticketInfo}>
                  <Search2Icon color="blackAlpha.700" />
                </PreviewTicket>
              </div> */}
          </div>
        )
      })}
    </SimpleGrid>
  )
}

export default TicketsList
