export type SupportedCurrency = 'INR' | 'USD'

type CurrencyConfig = {
  locale: string
  currency: SupportedCurrency
  minimumFractionDigits: number
  maximumFractionDigits: number
}

const INR_TO_USD_RATE = 83

const CURRENCY_CONFIG: Record<SupportedCurrency, CurrencyConfig> = {
  INR: {
    locale: 'en-IN',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
  USD: {
    locale: 'en-US',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
}

const FORMATTER_CACHE: Record<SupportedCurrency, Intl.NumberFormat> = {
  INR: new Intl.NumberFormat(CURRENCY_CONFIG.INR.locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.INR.currency,
    minimumFractionDigits: CURRENCY_CONFIG.INR.minimumFractionDigits,
    maximumFractionDigits: CURRENCY_CONFIG.INR.maximumFractionDigits,
  }),
  USD: new Intl.NumberFormat(CURRENCY_CONFIG.USD.locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.USD.currency,
    minimumFractionDigits: CURRENCY_CONFIG.USD.minimumFractionDigits,
    maximumFractionDigits: CURRENCY_CONFIG.USD.maximumFractionDigits,
  }),
}

export function convertFromInr(
  amountInInr: number,
  currency: SupportedCurrency,
) {
  if (currency === 'USD') {
    return amountInInr / INR_TO_USD_RATE
  }

  return amountInInr
}

export function formatCurrencyFromInr(
  amountInInr: number,
  currency: SupportedCurrency,
) {
  const normalizedAmount = convertFromInr(amountInInr, currency)

  return FORMATTER_CACHE[currency].format(normalizedAmount)
}

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency = 'USD',
): string {
  return FORMATTER_CACHE[currency].format(amount)
}

export function formatDateInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function formatTimeInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}
