import {
  Box,
  Button,
  Container,
  Stack,
  Text,
  VisuallyHidden,
  Icon,
  useColorMode
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { FaGithubAlt } from 'react-icons/fa'
import XIcon from '@/components/Icon/X'
import ToriiIcon from '../Icon/Torii'

interface SocialButtonProps {
  children: React.ReactNode
  label: string
  href: string
}

const SocialButton: React.FC<SocialButtonProps> = ({
  children,
  label,
  href
}) => {
  return (
    <Button
      rounded={'full'}
      cursor={'pointer'}
      as={'a'}
      href={href}
      target="_blank"
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Button>
  )
}

const Footer: React.FC = () => {
  const { t } = useTranslation('common')
  const { colorMode } = useColorMode()
  return (
    <Box p={5} bottom={0} position="relative">
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>{t('COPYRIGHT_LINE')}</Text>
        <Stack direction="row" spacing={3} flexWrap="wrap">
          <SocialButton label={'X'} href={'https://twitter.com/henkakuorg'}>
            <Icon as={XIcon} fill={colorMode === 'dark' ? '#fff' : 'inherit'} />
          </SocialButton>
          <SocialButton
            label={'github'}
            href={'https://github.com/henkaku-center/henkaku-nengajo-frontend'}
          >
            <Text mr={1}>Frontend</Text>
            <Icon as={FaGithubAlt} />
          </SocialButton>
          <SocialButton
            label={'github'}
            href={'https://github.com/henkaku-center/henkaku-nengajo-contract'}
          >
            <Text mr={1}>Contract</Text>
            <Icon as={FaGithubAlt} />
          </SocialButton>
          <Button
            rounded={'full'}
            cursor={'pointer'}
            as={'a'}
            href="/omamori/create"
            display={'inline-flex'}
            alignItems={'center'}
            justifyContent={'center'}
            transition={'background 0.3s ease'}
          >
            <Text mr={1}>Admin</Text>
            <Icon as={ToriiIcon} />
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
