import { formatCurrencyFromInr, type SupportedCurrency } from '@local/utils'
import { Suspense, use, useDeferredValue, useState, useTransition } from 'react'
import './App.css'
import { ErrorBoundary } from './components/error-boundary'
import {
  getBootstrapRatesRequest,
  getFreshRatesRequest,
  type MetalRate,
  type RateSnapshot,
} from './lib/rates-api'

type DashboardContentProps = {
  currency: SupportedCurrency
  isRefreshing: boolean
  onCurrencyChange: (currency: SupportedCurrency) => void
  onRefresh: () => void
  ratesRequest: Promise<RateSnapshot>
}

function getBaseUnitPrice(rate: MetalRate, currency: SupportedCurrency) {
  if (rate.unit.includes('10g')) {
    return `${formatCurrencyFromInr(rate.price / 10, currency)} / g`
  }

  if (rate.unit.toLowerCase().includes('kg')) {
    return `${formatCurrencyFromInr(rate.price / 1000, currency)} / g`
  }

  return getDisplayUnit(rate.unit, currency)
}

function getDisplayUnit(unit: string, currency: SupportedCurrency) {
  if (currency === 'INR') {
    return unit
  }

  return unit.replace(/INR/gi, 'USD')
}

function DashboardContent({
  currency,
  isRefreshing,
  onCurrencyChange,
  onRefresh,
  ratesRequest,
}: DashboardContentProps) {
  const snapshot = use(ratesRequest)

  const metalCards = [
    {
      accent: 'gold',
      title: snapshot.goldRate.metal,
      rate: snapshot.goldRate,
    },
    {
      accent: 'silver',
      title: snapshot.silverRate.metal,
      rate: snapshot.silverRate,
    },
  ] as const

  return (
    <>
      <section className='overview-card'>
        <div className='overview-copy'>
          <p className='eyebrow'>Bullion rate desk</p>
          <h1>Live gold and silver prices from the Express API</h1>
          <p className='overview-text'>
            Minimal market dashboard with clear API-backed values for daily
            decision making.
          </p>
        </div>

        <div className='overview-meta'>
          <div className='controls-row'>
            <span className='status-pill'>
              <span className='status-dot' aria-hidden='true'></span>
              {isRefreshing ? 'Refreshing data' : 'Latest snapshot'}
            </span>

            <div className='currency-switch' role='group' aria-label='Currency'>
              <button
                type='button'
                className={`currency-button ${currency === 'INR' ? 'active' : ''}`}
                onClick={() => onCurrencyChange('INR')}
              >
                INR
              </button>
              <button
                type='button'
                className={`currency-button ${currency === 'USD' ? 'active' : ''}`}
                onClick={() => onCurrencyChange('USD')}
              >
                USD
              </button>
            </div>
          </div>
          {currency === 'USD' ? (
            <p className='fx-note'>Converted using 1 USD = 83 INR.</p>
          ) : null}

          <div className='snapshot-grid'>
            <div>
              <p className='label'>Date</p>
              <strong>{snapshot.currentDate}</strong>
            </div>
            <div>
              <p className='label'>Time</p>
              <strong>{snapshot.currentTime}</strong>
            </div>
            <div>
              <p className='label'>Timezone</p>
              <strong>{snapshot.timezone}</strong>
            </div>
            <div>
              <p className='label'>Source</p>
              <strong>{snapshot.source}</strong>
            </div>
          </div>

          <button
            type='button'
            className='refresh-button'
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh rates'}
          </button>
        </div>
      </section>

      <section className='metals-grid' aria-live='polite'>
        {metalCards.map(({ accent, title, rate }) => (
          <article className={`metal-card ${accent}`} key={title}>
            <div className='card-topline'>
              <h2>{title}</h2>
              <span className='purity-badge'>{rate.purity}</span>
            </div>

            <p className='display-price'>
              {formatCurrencyFromInr(rate.price, currency)}
            </p>
            <p className='unit-copy'>{getDisplayUnit(rate.unit, currency)}</p>

            <dl className='metric-list'>
              <div>
                <dt>Purity</dt>
                <dd>{rate.purity}</dd>
              </div>
              <div>
                <dt>Quoted unit</dt>
                <dd>{getDisplayUnit(rate.unit, currency)}</dd>
              </div>
              <div>
                <dt>Base view</dt>
                <dd>{getBaseUnitPrice(rate, currency)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </>
  )
}

function DashboardLoading() {
  return (
    <>
      <section className='overview-card'>
        <div className='overview-copy'>
          <p className='eyebrow'>Bullion rate desk</p>
          <h1>Live gold and silver prices from the Express API</h1>
          <p className='overview-text'>Loading latest rates.</p>
        </div>

        <div className='overview-meta skeleton-shell' aria-hidden='true'>
          <div className='skeleton-line skeleton-title'></div>
          <div className='skeleton-grid'>
            <div className='skeleton-line'></div>
            <div className='skeleton-line'></div>
            <div className='skeleton-line'></div>
            <div className='skeleton-line'></div>
          </div>
          <div className='skeleton-line short'></div>
        </div>
      </section>

      <section className='metals-grid' aria-hidden='true'>
        {Array.from({ length: 2 }, (_, index) => (
          <article className='metal-card skeleton-card' key={index}>
            <div className='skeleton-line skeleton-title'></div>
            <div className='skeleton-line skeleton-price'></div>
            <div className='skeleton-line'></div>
            <div className='skeleton-line short'></div>
          </article>
        ))}
      </section>
    </>
  )
}

type DashboardErrorProps = {
  error: Error
  onRetry: () => void
}

function DashboardError({ error, onRetry }: DashboardErrorProps) {
  return (
    <>
      <section className='overview-card'>
        <div className='overview-copy'>
          <p className='eyebrow'>Bullion rate desk</p>
          <h1>Live gold and silver prices from the Express API</h1>
          <p className='overview-text'>The API request failed this time.</p>
        </div>

        <div className='overview-meta error-card' role='alert'>
          <h2>Unable to load rates</h2>
          <p className='error-text'>{error.message}</p>
          <button type='button' className='refresh-button' onClick={onRetry}>
            Try again
          </button>
        </div>
      </section>
    </>
  )
}

function App() {
  const [ratesRequest, setRatesRequest] = useState(() =>
    getBootstrapRatesRequest(),
  )
  const [currency, setCurrency] = useState<SupportedCurrency>('INR')
  const deferredRatesRequest = useDeferredValue(ratesRequest)
  const [isPending, startRefreshTransition] = useTransition()
  const isRefreshing = isPending || deferredRatesRequest !== ratesRequest

  function refreshRates() {
    startRefreshTransition(() => {
      setRatesRequest(getFreshRatesRequest())
    })
  }

  return (
    <main className='dashboard-shell'>
      <ErrorBoundary
        resetKey={ratesRequest}
        fallback={(error, reset) => (
          <DashboardError
            error={error}
            onRetry={() => {
              reset()
              refreshRates()
            }}
          />
        )}
      >
        <Suspense fallback={<DashboardLoading />}>
          <DashboardContent
            currency={currency}
            isRefreshing={isRefreshing}
            onCurrencyChange={setCurrency}
            onRefresh={refreshRates}
            ratesRequest={deferredRatesRequest}
          />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}

export default App
