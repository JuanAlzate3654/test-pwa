import React from 'react'
export class ErrorBoundary extends React.Component<{ fallback: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err: any) { console.error('[Remote error]', err) }
  render() { return this.state.hasError ? this.props.fallback : this.props.children }
}