import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against benign development/preview environment WebSocket disconnect unhandled rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason?.message || (typeof reason === 'string' ? reason : '');
    if (
      msg.includes('WebSocket closed without opened') ||
      msg.includes('[vite] failed to connect to websocket') ||
      msg.includes('failed to connect to websocket')
    ) {
      event.preventDefault();
      // Silently prevent benign development-only HMR disconnect from bubbling as an application unhandled rejection
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
