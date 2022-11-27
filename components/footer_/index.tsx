import {
  Box,
  Button,
  Container,
  Stack,
  Text,
  VisuallyHidden,
  Icon
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { FaGithubAlt } from 'react-icons/fa'
import { AiFillTwitterCircle } from 'react-icons/ai'

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

// COMMENT
const Footer: React.FC = () => {
  const { t } = useTranslation('common')
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
        <Stack direction={'row'} spacing={6}>
          <SocialButton
            label={'Instagram'}
            href={'https://twitter.com/henkakuorg'}
          >
            <Icon as={AiFillTwitterCircle} />
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
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
