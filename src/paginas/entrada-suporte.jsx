import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Suporte from './Suporte.jsx'

// Ponto de entrada da página /suporte/ (clientes abrem chamados)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suporte />
  </StrictMode>,
)
