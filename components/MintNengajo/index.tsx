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
  Stack
} from '@chakra-ui/react'
import { useState, ReactElement, useEffect } from 'react'
import { NFTImage } from '@/components/NFTImage'
import { useAccount } from 'wagmi'
import useTranslation from 'next-translate/useTranslation'
import styles from './MintNengajo.module.css'
import { NengajoInfoProps } from '@/hooks/useNengajoInfo'
import {
  useIsHoldingByTokenId,
  useMintNengajo
} from '@/hooks/useNengajoContract'
import { LinkIcon } from '@chakra-ui/icons'
import TwitterIcon from '../Icon/Twitter'
import OpenseaIcon from '../Icon/Opensea'
import { parseIpfs2Pinata } from '@/utils/ipfs2http'
import SecretMessage from './SecretMessage'

interface Props {
  id: number
  item: NengajoInfoProps
  imageOnly?: boolean
}
interface mintStateProps {
  status: 'minted' | 'mintable' | 'noMintable'
  freeMintable: boolean
}
const MintNengajo: React.FC<Props> = ({ id, item, imageOnly, ...props }) => {
  const { t } = useTranslation('nengajo')
  const { isConnected } = useAccount()
  const {
    writeAsync,
    isLoading: isMinting,
    isSuccess,
    minted
  } = useMintNengajo(id)
  const { isHolding } = useIsHoldingByTokenId(id)

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
    } catch (error) {
      // TODO: errorメッセージをToastに入れる
      console.log(error)
    }
  }

  useEffect(() => {
    if (minted) {
      setMintState({ status: 'minted', freeMintable: false })
    }
  }, [minted])

  if (!isConnected) return <></>
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
          {item && (
            <NFTImage imageUrl={parseIpfs2Pinata(item?.tokenURIJSON?.image)} />
          )}
          <Text mt={5}>{item?.tokenURIJSON?.description}</Text>
        </GridItem>
        {!imageOnly && (
          <GridItem>
            <Box mb={{ lg: 10 }}>
              {(mintState.status === 'minted' || isHolding) && (
                <Box>
                  <Text>{t('TITLE.MINTED')}</Text>
                  <Box mt={5}>
                    <Text size="sm">{t('TITLE.SHARE')}</Text>
                    <Stack direction="row" spacing={4} mt={2}>
                      {/* リンクをつける */}
                      <LinkIcon fontSize="25px" />
                      <TwitterIcon fontSize="30px" />
                      <OpenseaIcon fontSize="30px" />
                    </Stack>
                  </Box>
                </Box>
              )}
              {mintState.status === 'noMintable' && t('TITLE.NOT_MINTABLE')}
              {mintState.status === 'mintable' && !isHolding && (
                <>
                  {approved ? (
                    <Box>
                      <Text>{t('TITLE.MINTABLE')}</Text>
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
              {mintState.freeMintable && (
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
              )}
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
            </Box>
          </GridItem>
        )}
      </Grid>
    </>
  )
}
export default MintNengajo

interface PreviewNengajoProps {
  id: number
  item: NengajoInfoProps
  children: ReactElement
}

export const PreviewNengajo = ({
  id,
  item,
  children,
  ...props
}: PreviewNengajoProps) => {
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
            <MintNengajo id={Number(id)} item={item} imageOnly {...props} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
