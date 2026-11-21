import { useEffect, useState } from 'react'
import { db } from './util'

export default function Config() {
  const [f, setF] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    db.from('nukze_config')
      .select('chave_pix, nome_recebedor')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) =>
        setF({
          chave_pix: data?.chave_pix || '',
          nome_recebedor: data?.nome_recebedor || '',
        }),
      )
  }, [])

  async function salvar(e) {
    e.preventDefault()
    const { error } = await db
      .from('nukze_config')
      .update({
        chave_pix: f.chave_pix.trim() || null,
        nome_recebedor: f.nome_recebedor.trim() || null,
        atualizado_em: new Date().toISOString(),
      })
      .eq('id', 1)
    setMsg(error ? 'Não deu pra salvar.' : 'Salvo')
  }

  if (!f) return <p className="pn-carregando">Carregando…</p>
  return (
    <>
      <header className="pn-cab">
        <h1>Ajustes</h1>
        <p>Dados que vão na mensagem de cobrança.</p>
      </header>
      <form className="pn-cartao pn-form pn-form--solta" onSubmit={salvar}>
        <label>
          Chave Pix
          <input
            value={f.chave_pix}
            maxLength={100}
            placeholder="financeiro@nukze.com.br"
            onChange={(e) => setF({ ...f, chave_pix: e.target.value })}
          />
        </label>
        <label>
          Nome de quem recebe (aparece no Pix)
          <input
            value={f.nome_recebedor}
            maxLength={80}
            placeholder="Daniel Alves"
            onChange={(e) => setF({ ...f, nome_recebedor: e.target.value })}
          />
        </label>
        <div className="pn-form__bts">
          {msg && <span className="pn-msg">{msg}</span>}
          <button className="pn-bt pn-bt--pri">Salvar</button>
        </div>
      </form>
    </>
  )
}
