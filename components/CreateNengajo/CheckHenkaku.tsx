import { useCalcRequiredHenkakuAmount } from '@/hooks/useNengajoContract'
import { Box, Button } from '@chakra-ui/react'
import { BigNumber, utils } from 'ethers'
import { FC } from 'react'

type Props = {
  maxSupply: number
}

const CheckHenkaku: FC<Props> = ({ maxSupply }) => {
  const { data, isLoading } = useCalcRequiredHenkakuAmount(maxSupply)

  return (
    <Box px={5} lineHeight="12px">
      {data && utils.formatEther(data)}
      <Box as="span" fontSize="9px">
        {' '}
        HENKAKU
      </Box>
    </Box>
  )
}

export default CheckHenkaku
