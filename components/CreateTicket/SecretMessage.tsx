import { Box, Text, Textarea } from '@chakra-ui/react'
import { FC } from 'react'
import useTranslation from 'next-translate/useTranslation'

const SecretMessageForm: FC = () => {
  const { t, lang } = useTranslation('common')
  return (
    <Box>
      <Text>{t('NEW_TICKET_SECRET_PROMPT')}</Text>
      <Textarea rows={5} mt={3} />
    </Box>
  )
}

export default SecretMessageForm
