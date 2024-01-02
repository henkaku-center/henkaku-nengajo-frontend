import { Box, Flex } from '@chakra-ui/react'
import { FC, useMemo } from 'react'

interface Props {
  id?: number
  size?: string
  color?: string
  highlight?: string
}

const Naifu: FC<Props> = ({ id, size }) => {
  const color = useMemo(() => {
    switch (id) {
      case 1:
        return { base: '#00f', highlight: '#adf' }
      case 2:
        return { base: '#fff', highlight: '#999' }
      case 3:
        return { base: '#ff0', highlight: '#ff9' }
      case 4:
        return { base: '#090', highlight: '#82AC74' }
      case 5:
        return { base: '#f00', highlight: '#f99' }
      case 6:
        return { base: '#f0f', highlight: '#f9f' }
      default:
        return { base: '#00f', highlight: '#adf' }
    }
  }, [id])
  if (size === 'thumb')
    return (
      <Flex
        mx="auto"
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
        bg="#1A202C"
        overflow="hidden"
      >
        <Box
          sx={{
            animation: 'spin 4s linear infinite',
            width: '100px',
            height: '100px',
            margin: 'auto',
            borderRadius: '50%',
            boxShadow: `inset 0 0 30px #fff,
          inset 10px 0 20px ${color.highlight},
          inset -10px 0 20px ${color.base},
          inset 10px 0 100px ${color.highlight},
          inset -10px 0 100px ${color.base},
          0 0 20px #fff,
          -10px 0 20px ${color.highlight},
          10px 0 20px ${color.base}
        `
          }}
        ></Box>
      </Flex>
    )
  return (
    <Flex
      mx="auto"
      width="100%"
      height={450}
      justifyContent="center"
      alignItems="center"
      bg="#1A202C"
      borderRadius={50}
      overflow="hidden"
    >
      <Box
        sx={{
          animation: 'spin 4s linear infinite',
          width: '250px',
          height: '250px',
          margin: 'auto',
          borderRadius: '50%',
          boxShadow: `inset 0 0 50px #fff,
          inset 20px 0 60px ${color.highlight},
          inset -20px 0 60px ${color.base},
          inset 20px 0 250px ${color.highlight},
          inset -20px 0 250px ${color.base},
          0 0 50px #fff,
          -10px 0 60px ${color.highlight},
          10px 0 60px ${color.base}
        `
        }}
      ></Box>
    </Flex>
  )
}

export default Naifu
