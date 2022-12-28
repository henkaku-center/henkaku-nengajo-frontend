import { ethers } from 'ethers'
import { useCallback, useMemo } from 'react'
import FowarderABI from '@/abi/Forwarder.json'
import PublicNengajoABI from '@/abi/PublicNengajo.json'
import { signMetaTxRequest } from '@/utils/signer'
import { useContract, useSigner } from 'wagmi'

const PUBLIC_NENGAJO_ADDRESS = '0x014122281213bCc1CD6f2eB9b9F9e0d199Db070F'
const FORWARDER_ADDRESS = '0x6470a42b6eF513d7A7A57741421E9154612c31E2'
const AUTOTASK_WEBHOOK_URL =
  'https://api.defender.openzeppelin.com/autotasks/11185c35-af59-4c6d-9d87-201324dfad04/runs/webhook/e476306f-6332-4741-bb96-fec21684480a/PqjvD3rf76UeS17gk1iEWB'

export const useMintNengajoWithMx = () => {
  const { data: signer } = useSigner()
  const nengajoContract = useContract({
    address: PUBLIC_NENGAJO_ADDRESS,
    abi: PublicNengajoABI.abi
  })

  const sendMetaTx = useCallback(async () => {
    if (!signer || !nengajoContract) return

    const forwarder = new ethers.Contract(
      FORWARDER_ADDRESS,
      FowarderABI.abi,
      signer
    )

    const from = await signer.getAddress()
    const data = nengajoContract.interface.encodeFunctionData('mint', [1])
    const to = nengajoContract.address

    if (!signer.provider) throw new Error('Provider is not set')

    const request = await signMetaTxRequest(signer.provider, forwarder, {
      to,
      from,
      data
    })

    return fetch(AUTOTASK_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: { 'Content-Type': 'application/json' }
    })
  }, [signer])

  return { sendMetaTx }
}
