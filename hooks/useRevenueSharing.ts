import { useMemo, useState } from 'react'
import { UseFormWatch } from 'react-hook-form'

export type SharesAmounts = number | null
export type ShareholdersAddress = string
export type RevenueSharingData = {
  shareholdersAddress: ShareholdersAddress
  sharesAmount: SharesAmounts
}

const useRevenueSharing = ({ watch }: { watch: any }) => {
  const [sharesAmounts, setShareAmounts] = useState<SharesAmounts[]>([])
  const [amountPercentages, setAmountPercentages] = useState<number[]>([])
  const [shareholdersAddresses, setShareholdersAddresses] = useState<
    ShareholdersAddress[]
  >([])
  const totalPercentage = (percentage: number[]) => {
    return percentage.reduce(
      (sum: number, amount: number) => Number(sum) + Number(amount),
      0
    )
  }
  const isCorrectPercentage = useMemo(() => {
    const total = totalPercentage(amountPercentages)
    return total === 100
  }, [amountPercentages])

  const mappingAmountPercentage = () => {
    const percentages = watch('revenueSharingData').map(
      (data: RevenueSharingData) => Number(data.sharesAmount)
    )
    setAmountPercentages(percentages)
    mappingSharesAmounts(percentages)
  }
  const mappingSharesAmounts = (percentages: number[]) => {
    if (totalPercentage(percentages) !== 100) {
      setShareAmounts([])
      return
    }
    const price = watch('price')
    const currentPrice = percentages.reduce(
      (sum: number, percentage: number) =>
        sum + Math.floor(price * (percentage / 100)),
      0
    )
    const amounts = percentages.map((percentage: number, i: number) => {
      return (
        Math.floor(price * (percentage / 100)) +
        (i === 0 ? price - currentPrice : 0)
      )
    })
    setShareAmounts(amounts)
  }
  const mappingShareholdersAddresses = () => {
    const holdersAddresses = watch('revenueSharingData').map(
      (data: RevenueSharingData) => data.shareholdersAddress
    )
    setShareholdersAddresses(holdersAddresses)
  }
  return {
    sharesAmounts,
    shareholdersAddresses,
    isCorrectPercentage,
    mappingAmountPercentage,
    mappingShareholdersAddresses
  }
}

export { useRevenueSharing }
