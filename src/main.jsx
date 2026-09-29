import { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('JAGO RootErrorBoundary caught an error:', error, errorInfo);
  }

  handleTryAgain = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReset = () => {
    try {
      localStorage.removeItem('jago_auth_user');
      localStorage.removeItem('jago_auth_officer');
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const errMsg = this.state.error ? (this.state.error.message || String(this.state.error)) : 'Unknown anomaly';
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          backgroundColor: '#F8FAFC',
          color: '#0F172A',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: '#FFEDD5',
            color: '#FF6B2C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            marginBottom: '16px'
          }}>
            ⚠️
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>
            JAGO Session Notice
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '300px', marginBottom: '16px', lineHeight: '1.5' }}>
            A temporary display sync occurred. Your account and documents are safely preserved.
          </p>
          <div style={{
            background: '#F1F5F9',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '11px',
            color: '#475569',
            fontFamily: 'monospace',
            maxWidth: '320px',
            wordBreak: 'break-word',
            marginBottom: '20px',
            border: '1px solid #E2E8F0'
          }}>
            {errMsg}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={this.handleTryAgain}
              style={{
                padding: '12px 20px',
                borderRadius: '14px',
                backgroundColor: '#FF6B2C',
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 107, 44, 0.3)'
              }}
            >
              Resume App
            </button>
            <button
              onClick={this.handleReset}
              style={{
                padding: '12px 18px',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                color: '#64748B',
                fontWeight: '600',
                fontSize: '13px',
                border: '1px solid #CBD5E1',
                cursor: 'pointer'
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);
