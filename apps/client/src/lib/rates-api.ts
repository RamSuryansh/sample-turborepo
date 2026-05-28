export type MetalRate = {
  metal: string
  purity: string
  unit: string
  price: number
}

export type RateSnapshot = {
  currentDate: string
  currentTime: string
  timezone: string
  goldRate: MetalRate
  silverRate: MetalRate
  source: string
}

const REQUEST_TIMEOUT_MS = 8000
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const RATES_ENDPOINT = `${API_BASE_URL}/rates/today`

let bootstrapRatesRequest: Promise<RateSnapshot> | null = null

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseMetalRate(value: unknown, fieldName: string): MetalRate {
  if (!isRecord(value)) {
    throw new Error(`${fieldName} is missing in the API response`)
  }

  const { metal, purity, unit, price } = value

  if (
    typeof metal !== 'string' ||
    typeof purity !== 'string' ||
    typeof unit !== 'string' ||
    typeof price !== 'number'
  ) {
    throw new Error(`${fieldName} has an invalid shape`)
  }

  return { metal, purity, unit, price }
}

function parseRateSnapshot(value: unknown): RateSnapshot {
  if (!isRecord(value)) {
    throw new Error('Rates response must be an object')
  }

  const { currentDate, currentTime, timezone, source, goldRate, silverRate } = value

  if (
    typeof currentDate !== 'string' ||
    typeof currentTime !== 'string' ||
    typeof timezone !== 'string' ||
    typeof source !== 'string'
  ) {
    throw new Error('Rates response is missing one or more top-level fields')
  }

  return {
    currentDate,
    currentTime,
    timezone,
    source,
    goldRate: parseMetalRate(goldRate, 'goldRate'),
    silverRate: parseMetalRate(silverRate, 'silverRate'),
  }
}

async function fetchRatesFromApi(): Promise<RateSnapshot> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(RATES_ENDPOINT, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Rates API failed with status ${response.status}`)
    }

    const payload = (await response.json()) as unknown
    return parseRateSnapshot(payload)
  } catch (requestError) {
    if (requestError instanceof DOMException && requestError.name === 'AbortError') {
      throw new Error(`Rates API request timed out after ${REQUEST_TIMEOUT_MS}ms`, {
        cause: requestError,
      })
    }

    if (requestError instanceof Error) {
      throw requestError
    }

    throw new Error('Failed to load rates from the API', { cause: requestError })
  } finally {
    window.clearTimeout(timeout)
  }
}

export function getBootstrapRatesRequest() {
  if (!bootstrapRatesRequest) {
    bootstrapRatesRequest = fetchRatesFromApi()
  }

  return bootstrapRatesRequest
}

export function getFreshRatesRequest() {
  return fetchRatesFromApi()
}
