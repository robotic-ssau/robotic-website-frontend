import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/app/styles/antd-tokens.css';
import '@/app/styles/index.css';
import { Providers } from './providers';
import { AppRouter } from './providers/router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <AppRouter />
    </Providers>
  </StrictMode>,
);
