import { useCalcRequiredHenkakuAmount } from '@/hooks/useNengajoContract'
import { Box, Button, Spinner } from '@chakra-ui/react'
import { BigNumber, utils } from 'ethers'
import { FC, useMemo } from 'react'

type Props = {
  maxSupply: number
}

const CheckHenkaku: FC<Props> = ({ maxSupply }) => {
  const { data, isLoading } = useCalcRequiredHenkakuAmount(maxSupply)

  const formatedPrice = useMemo(() => {
    try {
      return utils.formatEther(data)
    } catch (error) {
      return 0
    }
  }, [data])

  return (
    <Box px={5} lineHeight="12px">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {formatedPrice}
          <Box as="span" fontSize="9px">
            {' '}
            HENKAKU
          </Box>
        </>
      )}
    </Box>
  )
}

export default CheckHenkaku
