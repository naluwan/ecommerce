'use client'
import React from 'react'

import classes from './index.module.scss'

const Promotion = () => {
  const [time, setTime] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + 3)

  React.useEffect(() => {
    const timerInterval = setInterval(() => {
      const currentTime = new Date()
      const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0)

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

      setTime({ days, hours, minutes, seconds })

      if (timeDifference === 0) {
        clearInterval(timerInterval)
        // You can add code here to handle what happens when the target date is reached.
      }
    }, 1000)

    return () => {
      clearInterval(timerInterval) // Cleanup the interval when the component unmounts.
    }
  }, [])

  return (
    <section className={classes.promotion}>
      <div className={classes.textBox}>
        <h3 className={classes.title}>每月特惠</h3>
        <p>每月特惠活動正在進行中！每一次購買都能享有獨家優惠！走過路過不要錯過！</p>

        <ul className={classes.stats}>
          <StatBox label="天" value={time.days} />
          <StatBox label="小時" value={time.hours} />
          <StatBox label="分鐘" value={time.minutes} />
          <StatBox label="秒" value={time.seconds} />
        </ul>
      </div>
    </section>
  )
}

const StatBox = ({ label, value }: { label: string; value: number }) => {
  return (
    <li className={classes.statBox}>
      <h4>{value}</h4>
      <p>{label}</p>
    </li>
  )
}

export default Promotion
