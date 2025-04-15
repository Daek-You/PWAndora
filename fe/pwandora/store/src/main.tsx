import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NativeFeatureProvider } from './contexts/NativeFeatureContext.tsx'
import { LanguageProvider } from './contexts/LanguageContext.tsx'
import './i18n.js' // import만 해두면 된다.

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/store">
      <QueryClientProvider client={queryClient}>
        <NativeFeatureProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </NativeFeatureProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
