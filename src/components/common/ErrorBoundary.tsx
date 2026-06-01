import { Component, type ReactNode } from 'react'
import { Button, Result } from 'antd'
import { RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Result
            status="error"
            title="出错了"
            subTitle={this.state.error?.message || '页面发生了意外错误'}
            extra={
              <Button
                type="primary"
                icon={<RefreshCw size={16} />}
                onClick={this.handleReset}
              >
                重试
              </Button>
            }
          />
        </div>
      )
    }

    return this.props.children
  }
}
