import { formatDateInTimeZone, formatTimeInTimeZone } from '@local/utils'
import express from 'express'

const app = express()
const port = Number(process.env.PORT) || 3001
const timezone = 'Asia/Kolkata'

function getTodayRateSnapshot() {
  const now = new Date()

  return {
    currentDate: formatDateInTimeZone(now, timezone),
    currentTime: formatTimeInTimeZone(now, timezone),
    timezone,
    goldRate: {
      metal: 'Gold',
      purity: '24K',
      unit: 'INR / 10g',
      price: 98750,
    },
    silverRate: {
      metal: 'Silver',
      purity: '999',
      unit: 'INR / kg',
      price: 108500,
    },
    source: 'sample-data',
  }
}

app.get('/', (_request, response) => {
  response.json({
    message: 'Sample rate server is running',
    data: getTodayRateSnapshot(),
  })
})

app.get('/rates/today', (_request, response) => {
  response.json(getTodayRateSnapshot())
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
