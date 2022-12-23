import { useLitDecryption } from '@/hooks/useLitProtocol'
import { Box, Button, Text } from '@chakra-ui/react'
import { FC, useCallback, useMemo, useState } from 'react'

type Props = {
  encryptedFile: string
  encryptedSymmetricKey: string
  tokenId: number
}

const SecretMessage: FC<Props> = ({
  encryptedFile,
  encryptedSymmetricKey,
  tokenId
}) => {
  const { decrypt } = useLitDecryption(tokenId)
  const [message, setMessage] = useState('')

  const decryptMessage = useCallback(async () => {
    const decryptedMessage = await decrypt(encryptedFile, encryptedSymmetricKey)
    let binary = ''
    const bytes = new Uint8Array(decryptedMessage?.decryptedFile)
    const len = bytes.byteLength
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    setMessage(window.btoa(binary))
  }, [decrypt])

  return (
    <Box>
      <Button onClick={() => decryptMessage()}>
        シークレット・メッセージをみる
      </Button>
      <img src={`data:image;base64, ${message}`} alt="" />
    </Box>
  )
}

export default SecretMessage
