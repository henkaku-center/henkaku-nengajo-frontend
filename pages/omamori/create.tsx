import type { NextPage } from 'next'
import { useApproval, useChainId, useMounted } from '@/hooks'
import Layout from '@/components/Layout'
import { useAccount } from 'wagmi'
import CreateOmamoriForm from '@/components/CreateOmamori/Form'
import { Connect } from '@/components'
import { Box, Heading, Text } from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import { getContractAddress } from '@/utils/contractAddresses'
import { Approve } from '@/components/Approve'

const CreateOmamori: NextPage = () => {
  const { t } = useTranslation('omamori')
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
      <Heading as="h2">{t('CREATE.NEW_OMAMORI')}</Heading>
      {isMounted && !isConnected && <Connect />}
      {isMounted && isConnected && !approved && (
        <Box mt={5}>
          <Text>{t('CREATE.NEW_OMAMORI_REQUIRE_HENKAKUTOKEN')}</Text>
          <Approve erc20={henkakuV2} spender={nengajo}>
            {t('CREATE.BUTTON_APPROVE')}
          </Approve>
        </Box>
      )}
      {isMounted && isConnected && approved && <CreateOmamoriForm />}
    </Layout>
  )
}

export default CreateOmamori
