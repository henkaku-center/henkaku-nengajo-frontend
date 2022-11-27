import {
  Heading,
  Box,
  Link,
  Flex,
  Spacer,
  Button,
  Stack,
  useColorMode
} from '@chakra-ui/react'
import { default as NextLink } from 'next/link'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import setLanguage from 'next-translate/setLanguage'

const Header: React.FC = () => {
  const router = useRouter()
  const { colorMode, toggleColorMode } = useColorMode()
  const { t, lang } = useTranslation('common')
  return (
    <Box p="4">
      <Flex>
        <Box p={2}>
          <NextLink passHref href="/" locale={router.locale}>
            <Link href="/">
              <Heading size="md">
                HENKAKU <span className="text_nengajo">{t('NENGAJO')}</span>
              </Heading>
            </Link>
          </NextLink>
        </Box>
        <Spacer />
        <Stack direction="row" spacing={4}>
          <NextLink passHref href="/" locale={router.locale}>
            <Link _focus={{ boxShadow: 'none' }} href="/" p={4}>
              {t('HOME_LINK')}
            </Link>
          </NextLink>
          <NextLink passHref href="/register" locale={router.locale}>
            <Link _focus={{ boxShadow: 'none' }} p={4}>
              {t('REGISTER_LINK')}
            </Link>
          </NextLink>
          {/* <NextLink passHref href="/nengajo" locale={router.locale}>
            <Link _focus={{ boxShadow: 'none' }} p={4}>
              {t('NENGAJO_LINK')}
            </Link>
          </NextLink>
          <NextLink passHref href="/collection" locale={router.locale}>
            <Link _focus={{ boxShadow: 'none' }} p={4}>
              {t('COLLECTION_LINK')}
            </Link>
          </NextLink> */}
          <Button size="md" onClick={toggleColorMode} p={4}>
            {colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>
          <Button
            size="md"
            onClick={async () => await setLanguage(lang == 'en' ? 'ja' : 'en')}
          >
            {lang == 'en' ? '日本語' : 'English'}
          </Button>
        </Stack>
      </Flex>
    </Box>
  )
}

export default Header
