import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from "./context/UserContext";
import { LiveEventProvider } from './context/LiveEventContect.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LiveEventProvider>
        <UserProvider>
          <App />
      </UserProvider>
    </LiveEventProvider>

  </StrictMode>,
)
