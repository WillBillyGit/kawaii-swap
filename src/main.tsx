import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Web3Providers } from './Web3Providers.tsx';

// Global suppression of Thirdweb Auth errors in preview environment
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('Authentication required')) {
      return;
    }
    if (args[0] && typeof args[0] === 'object' && args[0].message && args[0].message.includes('Authentication required')) {
      return;
    }
    originalError.apply(console, args);
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason === 'Authentication required' || (reason && reason.message === 'Authentication required')) {
      event.preventDefault();
      console.warn('Thirdweb auth suppressed:', reason);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3Providers>
      <App />
    </Web3Providers>
  </StrictMode>,
);
