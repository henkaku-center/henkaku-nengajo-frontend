import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

const useCountdown = (targetDate: string) => {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault('Asia/Tokyo')
  const JTC = dayjs.tz(new Date()).valueOf()

  const target = dayjs.tz(new Date(targetDate))

  const countDownDate = target.valueOf()
  const [countDown, setCountDown] = useState(countDownDate - JTC)
  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - JTC)
    }, 1000)
    return () => clearInterval(interval)
  }, [JTC, countDownDate])

  return getReturnValues(countDown)
}

const getReturnValues = (countDown: number) => {
  const d = Math.floor(countDown / (1000 * 60 * 60 * 24))
  const days = zeroPadding(d)
  const h = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const hours = zeroPadding(h)
  const m = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
  const minutes = zeroPadding(m)
  const s = Math.floor((countDown % (1000 * 60)) / 1000)
  const seconds = zeroPadding(s)
  const isStart: boolean = d + h + m + s <= 0 ? true : false

  return { days, hours, minutes, seconds, isStart }
}

const zeroPadding = (num: number) => {
  return ('00' + num).slice(-2)
}

export { useCountdown }
