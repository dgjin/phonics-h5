import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: '#555' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😵</div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>出错了</h2>
          <p style={{ fontSize: 14, color: '#888' }}>请刷新页面重试</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: '10px 24px', borderRadius: 20, border: 'none', background: '#1D9E75', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>刷新页面</button>
        </div>
      );
    }
    return this.props.children;
  }
}
