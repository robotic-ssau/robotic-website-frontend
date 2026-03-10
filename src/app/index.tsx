import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

import '@/app/styles/antd-tokens.css';
import '@/app/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
