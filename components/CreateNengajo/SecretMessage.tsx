import { Box, Text, Textarea } from '@chakra-ui/react'
import { FC } from 'react'

const SecretMessageForm: FC = () => {
  return (
    <Box>
      <Text>
        年賀状をMintしてくれた人だけが見ることのできる秘密のメッセージを送ってみませんか？
      </Text>
      <Textarea rows={5} mt={3} />
    </Box>
  )
}

export default SecretMessageForm
