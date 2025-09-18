import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"; // Mantén si es custom

import App from './App.tsx';
import { ErrorFallback } from './ErrorFallback.tsx';

import "./main.css";
import "./styles/theme.css";
import "./index.css";

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
  </ErrorBoundary>
);