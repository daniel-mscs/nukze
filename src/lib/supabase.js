import { createClient } from '@supabase/supabase-js'

// As chaves vêm do .env (no seu PC) ou das variáveis da Cloudflare (no site publicado).
// Só a chave ANON (pública). A service_role NUNCA entra no front-end.
const url = import.meta.env.VITE_SUPABASE_URL
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY

// Se faltar alguma variável, o site continua funcionando (só não salva pedidos)
export const supabase =
  url && chave
    ? createClient(url, chave, { auth: { persistSession: false } })
    : null
