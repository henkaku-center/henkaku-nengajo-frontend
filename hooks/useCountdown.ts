import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

const useCountdown = () => {
  // CountDown
  const targetDate =
    process.env.NODE_ENV === 'production'
      ? '2024/01/01 12:00:00' // 本番
      : '2024/01/01 12:00:00' // 開発用（動作確認はこちらを変更）
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault('Asia/Tokyo')
  const JTC = dayjs.tz(new Date(), 'Asia/Tokyo').valueOf()

  const countDownDate = dayjs.tz(targetDate, 'Asia/Tokyo').valueOf()

  const [countDown, setCountDown] = useState(
    getReturnValues(countDownDate - JTC)
  )
  useEffect(() => {
    const interval = setInterval(() => {
      const returnValue = getReturnValues(countDownDate - JTC)
      if (!countDown.isStart) setCountDown(returnValue)
    }, 1000)
    return () => clearInterval(interval)
  }, [JTC, countDownDate])

  return countDown
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
