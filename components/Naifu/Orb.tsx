import { Box, Flex } from '@chakra-ui/react'
import { FC } from 'react'

interface Props {
  color?: string
  highlight?: string
  delay?: number
}

const Orb: FC<Props> = ({ color = '#00f', highlight = '#adf', delay = 0 }) => {
  return (
    <Box
      sx={{
        animation: `flow ${delay + 4}s linear infinite ${delay}s`,
        margin: 'auto'
      }}
    >
      <Box
        sx={{
          animation: `spin 4s linear infinite ${delay}s`,
          width: '20px',
          height: '20px',
          margin: 'auto',
          borderRadius: '50%',
          boxShadow: `inset 0 0 20px #fff,
          inset 20px 0 20px ${highlight},
          inset -20px 0 20px ${color},
          inset 20px 0 20px ${highlight},
          inset -20px 0 20px ${color},
          0 0 20px #fff,
          -6px 0 20px ${highlight},
          6px 0 20px ${color}
        `
        }}
      ></Box>
    </Box>
  )
}

export default Orb
