import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'

const useChainId = () => {
  const { chain } = useNetwork()
  const expectedChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
  const chainId: number =
    expectedChainId != 0 && !isNaN(expectedChainId)
      ? expectedChainId
      : chain?.id ?? expectedChainId
  const [wrongNetwork, setWrongNetwork] = useState(false)
  useEffect(() => {
    setWrongNetwork(false)
    // If there is no expected network ID set on .env.local,
    // the user's network is never considered wrong
    if (expectedChainId === 0 || isNaN(expectedChainId)) return
    if (expectedChainId === chain?.id) return
    setWrongNetwork(true)
  }, [expectedChainId, chain])

  return { chainId, wrongNetwork }
}

export { useChainId }
