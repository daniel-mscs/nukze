import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Privacidade from './Privacidade.jsx'

// Ponto de entrada da página /privacidade/ (o Vite gera um HTML separado pra ela)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Privacidade />
  </StrictMode>,
)
