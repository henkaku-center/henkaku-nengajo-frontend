import { APPROVE_CALLBACK_STATUS, useApprove } from '@/hooks/useApproval'
import { Button } from '@chakra-ui/react'
import React from 'react'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  erc20: string
  spender: string
  children: React.ReactNode
  style?: any
}

export const Approve: React.FC<Props> = ({
  erc20,
  spender,
  children,
  style
}) => {
  const { status, approve } = useApprove(erc20, spender)
  const { t } = useTranslation('approve')

  return (
    <Button
      colorScheme="teal"
      mt={2}
      style={style}
      onClick={approve}
      isLoading={status == APPROVE_CALLBACK_STATUS.PENDING}
      loadingText={t('ENABLING')}
    >
      {children}
    </Button>
  )
}
