import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback: (error: Error, reset: () => void) => ReactNode
  resetKey: unknown
}

type ErrorBoundaryState = {
  error: Error | null
  lastResetKey: unknown
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      error: null,
      lastResetKey: props.resetKey,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error }
  }

  static getDerivedStateFromProps(
    props: ErrorBoundaryProps,
    state: ErrorBoundaryState,
  ): Partial<ErrorBoundaryState> | null {
    if (props.resetKey !== state.lastResetKey) {
      return {
        error: null,
        lastResetKey: props.resetKey,
      }
    }

    return null
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Dashboard rendering failed:', error, errorInfo)
  }

  reset = () => {
    this.setState({
      error: null,
      lastResetKey: this.props.resetKey,
    })
  }

  render() {
    const { error } = this.state

    if (error) {
      return this.props.fallback(error, this.reset)
    }

    return this.props.children
  }
}
