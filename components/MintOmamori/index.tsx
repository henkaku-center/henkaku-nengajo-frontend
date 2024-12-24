import {
  Heading,
  Text,
  Grid,
  GridItem,
  Button,
  Box,
  useToast,
  Stack,
  Link,
  useColorMode
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { NFTImage } from '@/components/NFTImage'
import useTranslation from 'next-translate/useTranslation'
import { OmamoriInfoProps } from '@/hooks/useOmamoriInfo'
import {
  useCurrentSupply,
  useIsHoldingByTokenId,
  useMintOmamoriWithMx
} from '@/hooks/useOmamoriContract'
import { LinkIcon } from '@chakra-ui/icons'
import XIcon from '@/components/Icon/X'
import OpenseaIcon from '@/components/Icon/Opensea'
import { parseIpfs2Pinata } from '@/utils/ipfs2http'
import Naifu from '../Naifu'
import NewlineToBr from '@/utils/NewlineToBr'
import { getContractAddress } from '@/utils/contractAddresses'
import { useChainId } from '@/hooks'
import { useIsMintedByTokenId } from '@/hooks/useOmamoriContract'
interface Props {
  id: number
  item: OmamoriInfoProps
  imageOnly?: boolean
}
interface mintStateProps {
  status: 'minted' | 'mintable' | 'noMintable' | 'soldout'
}

const MintOmamori: React.FC<Props> = ({ id, item, imageOnly, ...props }) => {
  const { t } = useTranslation('omamori')
  const { colorMode } = useColorMode()

  const toast = useToast()
  const {
    sendMetaTx,
    isLoading: isMinting,
    minted
  } = useMintOmamoriWithMx(Number(id))
  const { isHolding } = useIsHoldingByTokenId(id)
  const { isMinted } = useIsMintedByTokenId(id)
  const { data: currentSupply, isLoading: isLoadingCurrentSupply } =
    useCurrentSupply(id)
  const { chainId } = useChainId()

  const [mintState, setMintState] = useState<mintStateProps>({
    status: 'mintable'
  })

  const [showDetail, setShowDetail] = useState(true)

  // TODO: useApproval から取得
  const approved = true

  const mint = async () => {
    try {
      await sendMetaTx()
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
    if (Number(item.maxSupply) <= currentSupply?.toNumber()) {
      setMintState({ ...mintState, status: 'soldout' })
    }
  }, [currentSupply])

  useEffect(() => {
    if (minted) {
      setMintState({ ...mintState, status: 'minted' })
    }
  }, [minted])

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || isMinted) {
      setShowDetail(true)
    }
  }, [isMinted])

  const creatorName =
    item?.tokenURIJSON?.attributes?.length > 0
      ? item?.tokenURIJSON?.attributes.reduce((text, attribute) => {
          const currentText =
            attribute?.trait_type === 'CreatorName' ? attribute.value : ''
          return text + currentText
        }, '')
      : ''

  return (
    <>
      <Box mb={5}>
        <Heading mt={imageOnly ? 5 : 50} size="lg">
          {mintState.status === 'minted' || showDetail
            ? t('OMAMORI')
            : t('NAIFU')}
          「{item?.tokenURIJSON?.name}」
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
          {item &&
            (mintState.status === 'minted' || showDetail ? (
              <NFTImage
                imageUrl={parseIpfs2Pinata(item?.tokenURIJSON?.image)}
              />
            ) : (
              <Naifu id={Number(item?.id)} />
            ))}
          {creatorName && (
            <Text textAlign="right" fontSize="sm" mt={1}>
              {creatorName.includes('Created')
                ? creatorName
                : `created by ${creatorName}`}
            </Text>
          )}
          <Text mt={5}>{item?.tokenURIJSON?.description}</Text>
        </GridItem>
        {!imageOnly && (
          <GridItem>
            <Box mb={{ lg: 10 }}>
              <>
                {(mintState.status === 'minted' || showDetail) && (
                  <Box>
                    <Box>
                      <Text size="sm">
                        <NewlineToBr>{t('MESSAGE_DESCRIPTION')}</NewlineToBr>
                      </Text>
                    </Box>
                    <Box mt={5}>
                      <Text size="sm">{t('TITLE.SHARE')}</Text>
                      <Stack direction="row" spacing={4} mt={2}>
                        {/* リンクをつける */}
                        <LinkIcon fontSize="25px" />
                        <XIcon
                          fontSize="30px"
                          fill={colorMode === 'dark' ? '#fff' : 'inherit'}
                        />
                        <Link
                          href={`https://opensea.io/assets/matic/${getContractAddress(
                            {
                              name: 'omamori',
                              chainId: chainId
                            }
                          )}/${id}`}
                          isExternal
                        >
                          <OpenseaIcon fontSize="30px" />
                        </Link>
                      </Stack>
                    </Box>
                  </Box>
                )}
                {mintState.status === 'noMintable' && t('TITLE.NOT_MINTABLE')}
                {mintState.status === 'soldout' && 'SOLD OUT'}
                {mintState.status === 'mintable' && !showDetail && (
                  <>
                    {approved ? (
                      <Box>
                        <Text>{t('TITLE.MINTABLE')}</Text>
                        <Button
                          width="100%"
                          colorScheme="purple"
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
              </>
            </Box>
          </GridItem>
        )}
      </Grid>
    </>
  )
}
export default MintOmamori
