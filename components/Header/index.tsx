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
import HomeIcon from '@/components/Icon/Home'
import CollectionIcon from '@/components/Icon/Collection'
import GlobalIcon from '@/components/Icon/Global'
import CreateIcon from '@/components/Icon/Create'
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
              <Heading size={{ base: 'xs', sm: 'md' }}>
                {t('HENKAKU')}{' '}
                <span className="text_nengajo">{t('NENGAJO')}</span>
              </Heading>
            </Link>
          </NextLink>
        </Box>
        <Spacer />
        <Stack direction="row" spacing={0}>
          <NextLink passHref href="/" locale={router.locale}>
            <Link _focus={{ boxShadow: 'none' }} href="/" p={4}>
              <HomeIcon fontSize={20} display={{ md: 'none' }} />
              <Box as="span" display={{ base: 'none', md: 'block' }}>
                {t('HOME_LINK')}
              </Box>
            </Link>
          </NextLink>
          <NextLink passHref href="/create" locale={router.locale}>
            <Link _focus={{ boxShadow: 'none' }} p={4}>
              <CreateIcon fontSize={20} display={{ md: 'none' }} />
              <Box as="span" display={{ base: 'none', md: 'block' }}>
                {t('CREATE_LINK')}
              </Box>
            </Link>
          </NextLink>
          {/* <NextLink passHref href="/nengajo" locale={router.locale}>
            <Link _focus={{ boxShadow: 'none' }} p={4}>
              {t('NENGAJO_LINK')}
            </Link>
          </NextLink> */}
          <NextLink passHref href="/collection" locale={router.locale}>
            <Link _focus={{ boxShadow: 'none' }} p={4}>
              <CollectionIcon fontSize={20} display={{ md: 'none' }} />
              <Box as="span" display={{ base: 'none', md: 'block' }}>
                {t('COLLECTION_LINK')}
              </Box>
            </Link>
          </NextLink>
          <Stack direction="row" spacing={3}>
            <Button size="md" onClick={toggleColorMode} p={4}>
              {colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            </Button>

            <Button
              size="md"
              onClick={async () =>
                await setLanguage(lang == 'en' ? 'ja' : 'en')
              }
            >
              <GlobalIcon display={{ md: 'none' }} />
              <Box as="span" display={{ base: 'none', md: 'block' }}>
                {lang == 'en' ? '日本語' : 'English'}
              </Box>
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </Box>
  )
}

export default Header
