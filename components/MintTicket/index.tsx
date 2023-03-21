import {
  Heading,
  Text,
  Grid,
  GridItem,
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  useDisclosure,
  Stack,
  useToast,
  Flex,
  Badge
} from '@chakra-ui/react'
import { useState, ReactElement, useEffect } from 'react'
import { NFTImage } from '@/components/NFTImage'
import { useAccount } from 'wagmi'
import useTranslation from 'next-translate/useTranslation'
import Trans from 'next-translate/Trans'
import styles from './MintTicket.module.css'
import { TicketInfoProps } from '@/hooks/useTicketInfo'
import {
  useCurrentSupply,
  useIsHoldingByTokenId,
  useMintTicket
} from '@/hooks/useTicketContract'
import { useCountdown } from '@/hooks/useCountdown'
import CountDown from '@/components/CountDown'
import { LinkIcon } from '@chakra-ui/icons'
import TwitterIcon from '@/components/Icon/Twitter'
import OpenseaIcon from '@/components/Icon/Opensea'
import { parseIpfs2Pinata } from '@/utils/ipfs2http'
import SecretMessage from '@/components/MintTicket/SecretMessage'
import UpdateSecretMessageCrypt from './UpdateSecretMessageCrypt'
import dayjs from 'dayjs'

interface Props {
  id: number
  item: TicketInfoProps
  imageOnly?: boolean
}
interface mintStateProps {
  status: 'minted' | 'mintable' | 'noMintable' | 'soldout'
  freeMintable: boolean
}
const MintTicket: React.FC<Props> = ({ id, item, imageOnly, ...props }) => {
  const { t } = useTranslation('ticket')
  const toast = useToast()
  const {
    writeAsync,
    isLoading: isMinting,
    isSuccess,
    minted
  } = useMintTicket(id)
  const { isHolding } = useIsHoldingByTokenId(id)
  const { data: currentSupply, isLoading: isLoadingCurrentSupply } =
    useCurrentSupply(id)

  const [mintState, setMintState] = useState<mintStateProps>({
    status: 'mintable',
    freeMintable: false
  })

  // TODO: useApproval から取得
  const approved = true

  const mint = async () => {
    if (!writeAsync) return
    try {
      await writeAsync({ recklesslySetUnpreparedArgs: [Number(id)] })
    } catch (error: any) {
      toast({
        id: 'MINT_FAILED',
        title: error?.message,
        status: 'error',
        duration: 5000,
        position: 'top'
      })
    }
  }

  useEffect(() => {
    if (item.maxSupply <= currentSupply?.toNumber()) {
      setMintState({ ...mintState, status: 'soldout' })
    }
  }, [currentSupply])

  useEffect(() => {
    if (minted) {
      setMintState({ ...mintState, status: 'minted', freeMintable: false })
    }
  }, [minted])

  const { isStart, ...countDown } = useCountdown()

  const creatorName =
    item?.tokenURIJSON?.attributes.length > 0
      ? item?.tokenURIJSON?.attributes.reduce((text, attribute) => {
          const currentText =
            attribute?.trait_type === 'CreatorName' ? attribute.value : ''
          return text + currentText
        }, '')
      : ''
  const isSale = ()=> {
    const now = Date.now()
    if(now < (item.open_blockTimestamp as number) * 1000) return 0
    if(now > (item.close_blockTimestamp as number) * 1000) return 2
    return 1
  }
  
  const blockTimeStamp = {
    salesStatus: isSale(),
    openText: dayjs(item.open_blockTimestamp as number * 1000).format('YYYY/MM/DD'),
    closeText: dayjs(item.close_blockTimestamp as number * 1000).format('YYYY/MM/DD'),
  }

  const { address } = useAccount()

  return (
    <>
      <Box>
        <Heading mt={imageOnly ? 5 : 50} size="lg">
          {item?.tokenURIJSON?.name}
        </Heading>
      </Box>
      <Grid
        templateColumns={{
          lg: !imageOnly ? '450px 1fr' : '1fr'
        }}
        alignItems="center"
        gap={{ lg: 6 }}
      >
        <GridItem>
          <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="xl" fontWeight="bold">
            <Badge ml={1} variant="outline" colorScheme="yellow">
              preview
            </Badge>
          </Text>
          <Text fontSize="sm" textAlign="right" mt={1}><>{t('SALES_PERIOD')}：{blockTimeStamp.openText}〜{blockTimeStamp.closeText}{t('SALES_PERIOD_HELPER')}</></Text>
          </Flex>
          {item && (
            <NFTImage imageUrl={parseIpfs2Pinata(item?.tokenURIJSON?.image)} />
          )}
          {creatorName && (
            <Text textAlign="right" fontSize="sm" mt={1}>{creatorName}</Text>
          )}
          <Text mt={5}>{item?.tokenURIJSON?.description}</Text>
        </GridItem>
        {!imageOnly && (
          <GridItem>
            <Box mb={{ lg: 10 }}>
              {blockTimeStamp.salesStatus !== 1 ? (
                <Box mt={{ base: 5 }}>
                  <Heading size="md">
                    {blockTimeStamp.salesStatus === 0 && <Text>{t('TITLE.BEFORE_SALE')}</Text>}
                    {blockTimeStamp.salesStatus === 2 && <Text>{t('TITLE.END_OF_SALE')}</Text>}
                  </Heading>
                </Box>
              ) : (
                <>
                  {(mintState.status === 'minted' || isHolding) && (
                    <Box>
                      <Text>{t('TITLE.MINTED')}</Text>
                      {/* <Box mt={5}>
                        <Text size="sm">{t('TITLE.SHARE')}</Text>
                        <Stack direction="row" spacing={4} mt={2}>
                          <LinkIcon fontSize="25px" />
                          <TwitterIcon fontSize="30px" />
                          <OpenseaIcon fontSize="30px" />
                        </Stack>
                      </Box> */}
                    </Box>
                  )}
                  {mintState.status === 'noMintable' && <Text>{t('TITLE.NOT_MINTABLE')}</Text>}
                  {mintState.status === 'soldout' && <Text>{t('TITLE.SOLD_OUT')}</Text>}
                  {mintState.status === 'mintable' && !isHolding && (
                    <>
                      {approved ? (
                        <Box>
                          <Text textAlign="right" fontSize="lg" mt={1}>{t('TITLE.MINTABLE')}</Text>
                          <Text textAlign="right" fontSize="2xl" fontWeight="bold"><>{item.price} HENKAKU</></Text>
                          <Button
                            width="100%"
                            colorScheme="teal"
                            mt={5}
                            loadingText="minting..."
                            isLoading={isMinting || (isSuccess && !minted)}
                            onClick={mint}
                          >
                            {t('MINT')}
                          </Button>
                        </Box>
                      ) : (
                        <Box mt="2em">{/* TODO: <Approve /> が入ります */}</Box>
                      )}
                    </>
                  )}
                  {/* {mintState.freeMintable && (
                    <>
                      {t('TITLE.FREE_MINTABLE')}
                      <Box>
                        <Button
                          width="100%"
                          colorScheme="teal"
                          mt={5}
                          loadingText="minting..."
                          isLoading={isMinting || (isSuccess && !minted)}
                          onClick={mint}
                        >
                          {t('MINT')}
                        </Button>
                        <Text mt={3}>
                          {t('TITLE.MAX_SUPPLY')}: {Number(item?.maxSupply)}
                        </Text>
                      </Box>
                    </>
                  )} */}
                  {item?.tokenURIJSON.encryptedFile &&
                    item?.tokenURIJSON.encryptedSymmetricKey &&
                    isHolding && (
                      <SecretMessage
                        encryptedFile={String(item.tokenURIJSON.encryptedFile)}
                        encryptedSymmetricKey={
                          item.tokenURIJSON.encryptedSymmetricKey
                        }
                        tokenId={id}
                      />
                    )}
                </>
              )}
              {item?.creator === address &&
                item?.tokenURIJSON?.encryptedSymmetricKey && (
                  <Box mt="1">
                    <UpdateSecretMessageCrypt
                      tokenId={id}
                      encryptedSymmetricKey={
                        item?.tokenURIJSON?.encryptedSymmetricKey
                      }
                    />
                  </Box>
                )}
            </Box>
          </GridItem>
        )}
      </Grid>
    </>
  )
}
export default MintTicket

interface PreviewTicketProps {
  id: number
  item: TicketInfoProps
  children: ReactElement
}

export const PreviewTicket = ({
  id,
  item,
  children,
  ...props
}: PreviewTicketProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <span className={styles.children} onClick={onOpen}>
        {children}
      </span>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <MintTicket id={Number(id)} item={item} imageOnly {...props} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
