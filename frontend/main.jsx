import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter as Router} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import PlayerContextProvider from './context/PlayerContext.jsx'
import { SearchProvider } from './context/SearchContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <SearchProvider>
        <PlayerContextProvider>
          <App />
        </PlayerContextProvider>
      </SearchProvider>
    </Router>
  </StrictMode>,
)
