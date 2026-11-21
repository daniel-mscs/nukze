import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/tokens.css'
import Painel from './painel/Painel.jsx'

// Ponto de entrada da página /painel/ (área interna da Nukze)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Painel />
  </StrictMode>,
)
