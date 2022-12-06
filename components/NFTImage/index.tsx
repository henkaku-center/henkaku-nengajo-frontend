import { Box, Text, Badge, Image, Center, useColorMode } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'

interface Prop {
  imageUrl: string
}

export const NFTImage: React.FC<Prop> = ({ imageUrl }) => {
  const { t } = useTranslation('common')
  const { colorMode } = useColorMode()

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold">
        <Badge ml={1} variant="outline" colorScheme="yellow">
          preview
        </Badge>
      </Text>
      <Center mt={1} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.200'}>
        <Image src={imageUrl} alt={t('IMAGE_PREVIEW_ALT')} maxHeight="500" />
      </Center>
    </Box>
  )
}
