import { Stat, StatNumber, StatHelpText, StatGroup } from '@chakra-ui/react'

interface Props {
  data: {
    days: string | boolean
    hours: string | boolean
    minutes: string | boolean
    seconds: string | boolean
  }
}
const CountDown: React.FC<Props> = ({ data }) => {
  const { days, hours, minutes, seconds } = data
  return (
    <>
      <StatGroup width="230px">
        <Stat width="50px" textAlign="center">
          <StatNumber>{days}</StatNumber>
          <StatHelpText>DAY</StatHelpText>
        </Stat>
        <Stat width="10px" textAlign="center">
          <StatNumber>：</StatNumber>
        </Stat>
        <Stat width="50px" textAlign="center">
          <StatNumber>{hours}</StatNumber>
          <StatHelpText>HRS</StatHelpText>
        </Stat>
        <Stat width="10px" textAlign="center">
          <StatNumber>：</StatNumber>
        </Stat>
        <Stat width="50px" textAlign="center">
          <StatNumber>{minutes}</StatNumber>
          <StatHelpText>MIN</StatHelpText>
        </Stat>
        <Stat width="10px" textAlign="center">
          <StatNumber>：</StatNumber>
        </Stat>
        <Stat width="50px" textAlign="center">
          <StatNumber>{seconds}</StatNumber>
          <StatHelpText>SEC</StatHelpText>
        </Stat>
      </StatGroup>
    </>
  )
}
export default CountDown
