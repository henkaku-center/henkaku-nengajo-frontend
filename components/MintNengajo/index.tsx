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
import { useMintNengajo } from '@/hooks/useNengajoContract'

interface Props {
  id: string | string[]
  imageOnly?: boolean
}
interface mintStateProps {
  status: 'minted' | 'mintable' | 'noMintable'
  freeMintable: boolean
}
const MintNengajo: React.FC<Props> = ({ id, imageOnly, ...props }) => {
  const { t } = useTranslation('nengajo')
  const { isConnected } = useAccount()
  const {
    writeAsync,
    isLoading: isMinting,
    isSuccess,
    minted
  } = useMintNengajo(Number(id))

  const [mintState, setMintState] = useState<mintStateProps>({
    status: 'mintable',
    freeMintable: false
  })

  // TODO: useApproval から取得
  const approved = true

  // TODO: dummy data
  const tokenURIJSON = {
    name: 'Nengajo Name ID:' + id,
    image: 'https://via.placeholder.com/500',
    description:
      'Nengajo description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  }

  const mint = async () => {
    if (!writeAsync) return
    try {
      await writeAsync({ recklesslySetUnpreparedArgs: [Number(id)] })
    } catch (error) {
      // TODO: errorメッセージをToastに入れる
      console.log(error)
    }
  }

  if (!isConnected) return <></>
  return (
    <>
      <Box>
        <Heading mt={50} size="lg">
          {tokenURIJSON?.name}
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
          {tokenURIJSON?.image && <NFTImage imageUrl={tokenURIJSON?.image} />}
          <Text mt={5}>{tokenURIJSON?.description}</Text>
        </GridItem>
        {!imageOnly && (
          <GridItem>
            <Box mb={{ lg: 10 }}>
              <Text>
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
                    <Text>
                      <Button
                        width="90%"
                        colorScheme="teal"
                        mt={2}
                        loadingText="minting..."
                      >
                        {t('MINT')}
                      </Button>
                    </Text>
                  </>
                )}
              </Text>
            </Box>
          </GridItem>
        )}
      </Grid>
    </>
  )
}
export default MintNengajo

interface PreviewNengajoProps {
  id: string | string[]
  children: ReactElement
}

export const PreviewNengajo = ({
  id,
  children,
  ...props
}: PreviewNengajoProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <MintNengajo id={id} imageOnly {...props} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
