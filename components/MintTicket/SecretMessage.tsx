import { useLitDecryption } from '@/hooks/useLitProtocol'
import {
  Box,
  Button,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react'
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
  const [message, setMessage] = useState<string>()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const decryptMessage = useCallback(async () => {
    if (!message) {
      const decryptedMessage = await decrypt(
        encryptedFile,
        encryptedSymmetricKey
      )
      let binary = ''
      const bytes = new Uint8Array(decryptedMessage?.decryptedFile)
      const len = bytes.byteLength
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      setMessage(window.btoa(binary))
    }
    onOpen()
  }, [decrypt])

  return (
    <Box>
      <Divider my={5} />
      <Button
        onClick={() => decryptMessage()}
        colorScheme="teal"
        height="auto"
        py={2}
      >
        このチケットホルダーだけが読める
        <br />
        メッセージ・カードをみる
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Box py={5}>
              <Image
                margin="0 auto"
                src={`data:image;base64, ${message}`}
                alt=""
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default SecretMessage
