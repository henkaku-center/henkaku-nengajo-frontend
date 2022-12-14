import type { NextPage } from 'next'
import { useApproval, useChainId, useMounted } from '@/hooks'
import Layout from '@/components/Layout'
import { useAccount } from 'wagmi'
import CreateNengajoForm from '@/components/CreateNengajo/Form'
import { Connect } from '@/components'
import { Box, Heading, List, ListItem, Text } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { getContractAddress } from '@/utils/contractAddresses'
import { Approve } from '@/components/Approve'

const Home: NextPage = () => {
  const { t } = useTranslation('common')
  const isMounted = useMounted()
  const { address, isConnected } = useAccount()
  const { chainId } = useChainId()

  const henkakuV2 = getContractAddress({
    name: 'henkakuErc20',
    chainId: chainId
  }) as `0x${string}`
  const nengajo = getContractAddress({
    name: 'nengajo',
    chainId: chainId
  }) as `0x${string}`
  const { approved } = useApproval(henkakuV2, nengajo, address)

  return (
    <Layout>
      <Heading as="h2">{t('CREATE_NEW_NENGAJO')}</Heading>
      {isMounted && !isConnected && <Connect />}
      {isMounted && isConnected && !approved && (
        <Box mt={5}>
          <Text>{t('NEW_NENGAJO_REQUIRE_HENKAKUTOKEN')}</Text>
          <List listStyleType="disc" pl={5} my={2}>
            <ListItem>{t('NEW_NENGAJO_HENKAKUTOKEN_0')}</ListItem>
            <ListItem>{t('NEW_NENGAJO_HENKAKUTOKEN_10')}</ListItem>
            <ListItem>{t('NEW_NENGAJO_HENKAKUTOKEN_100')}</ListItem>
          </List>
          <Approve erc20={henkakuV2} spender={nengajo}>
            {t('BUTTON_APPROVE')}
          </Approve>
        </Box>
      )}
      {isMounted && isConnected && approved && <CreateNengajoForm />}
    </Layout>
  )
}

export default Home
