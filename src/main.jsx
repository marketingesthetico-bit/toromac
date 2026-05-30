import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import './i18n';
import './index.css';
import App from './App';
import { AlternatesProvider } from './hooks/useAlternates';
import { initAnalytics } from './utils/analytics';

initAnalytics();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AlternatesProvider>
          <App />
        </AlternatesProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
