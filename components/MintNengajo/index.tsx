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
  useDisclosure
} from '@chakra-ui/react'
import { useState, ReactElement } from 'react'
import { NFTImage } from '@/components/NFTImage'
import { useAccount } from 'wagmi'
import useTranslation from 'next-translate/useTranslation'
import styles from './MintNengajo.module.css'
import { NengajoInfoProps } from '@/hooks/useNengajoInfo'

interface Props {
  item: NengajoInfoProps
  imageOnly?: boolean
}
interface mintStateProps {
  status: 'minted' | 'mintable' | 'noMintable'
  freeMintable: boolean
}
const MintNengajo: React.FC<Props> = ({ item, imageOnly, ...props }) => {
  const { t } = useTranslation('nengajo')
  const { isConnected } = useAccount()

  const [mintState, setMintState] = useState<mintStateProps>({
    status: 'mintable',
    freeMintable: false
  })

  // TODO: useApproval から取得
  const approved = true

  // TODO: Mint中ローディング状態にさせるためのフラグ
  const isMinting = false

  if (!isConnected || !item) return <></>
  return (
    <>
      <Box>
        <Heading mt={imageOnly ? 5 : 50} size="lg">
          {item?.tokenURIJSON.name}
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
          {item && <NFTImage imageUrl={item?.tokenURIJSON.image} />}
          <Text mt={5}>{item?.tokenURIJSON.description}</Text>
        </GridItem>
        {!imageOnly && (
          <GridItem>
            <Box mb={{ lg: 10 }}>
              {mintState.status === 'minted' && t('TITLE.MINTED')}
              {mintState.status === 'noMintable' && t('TITLE.NOT_MINTABLE')}
              {mintState.status === 'mintable' && (
                <>
                  {approved ? (
                    <Box>
                      <Text>{t('TITLE.MINTABLE')}</Text>
                      <Text fontSize="2xl">500 $HENKAKU</Text>
                      <Button
                        width="100%"
                        colorScheme="teal"
                        mt={5}
                        loadingText="minting..."
                        isLoading={isMinting}
                      >
                        {t('MINT')}
                      </Button>
                      <Text mt={3}>
                        {t('TITLE.MAX_SUPPLY')}: {item?.maxSupply.toNumber()}
                      </Text>
                    </Box>
                  ) : (
                    <Box mt="2em">{/* TODO: <Approve /> が入ります */}</Box>
                  )}
                </>
              )}
              {mintState.freeMintable && (
                <>
                  {t('TITLE.FREE_MINTABLE')}
                  <Button
                    width="90%"
                    colorScheme="teal"
                    mt={2}
                    loadingText="minting..."
                  >
                    {t('MINT')}
                  </Button>
                </>
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
  item: NengajoInfoProps
  children: ReactElement
}

export const PreviewNengajo = ({
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
            <MintNengajo item={item} imageOnly {...props} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
