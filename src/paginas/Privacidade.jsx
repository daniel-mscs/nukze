import { site, linkWhatsapp } from '../data/site'
import BannerCookies from '../components/BannerCookies'
import './Privacidade.css'

// ⚠️ Texto-base de política de privacidade (LGPD). Revise com calma e,
// se possível, peça pra alguém da área jurídica dar uma olhada.
const ATUALIZADA = 'novembro de 2026'

export default function Privacidade() {
  const { dono, links, nome, cidade } = site
  const contato = (
    <a
      href={linkWhatsapp('Oi! Tenho uma dúvida sobre meus dados (LGPD).')}
      target="_blank"
      rel="noopener noreferrer"
    >
      WhatsApp
    </a>
  )

  return (
    <>
      <header className="pv-topo">
        <div className="container pv-topo__barra">
          <a className="pv-logo" href="/">
            nukze<span>.</span>
          </a>
          <a className="btn" href="/">
            ← Voltar ao site
          </a>
        </div>
      </header>

      <main className="container pv">
        <span className="tag">LGPD</span>
        <h1>Política de privacidade</h1>
        <p className="pv-data">Última atualização: {ATUALIZADA}</p>

        <p>
          Esta página explica, de forma direta, quais dados o site da {nome}{' '}
          coleta, por que, onde eles ficam e como você pode pedir pra ver,
          corrigir ou apagar. Ela segue a Lei Geral de Proteção de Dados (Lei nº
          13.709/2018).
        </p>

        <h2>1. Quem é o responsável</h2>
        <p>
          O responsável pelos seus dados (o "controlador") é {dono.nome},
          desenvolvedor em {cidade}, que mantém a {nome}. Qualquer pedido sobre
          seus dados pode ser feito pelo {contato}
          {links.email && (
            <>
              {' '}
              ou pelo e-mail <a href={`mailto:${links.email}`}>{links.email}</a>
            </>
          )}
          .
        </p>

        <h2>2. Quais dados eu coleto</h2>
        <p>Só os que você mesmo preenche no formulário "Monte seu plano":</p>
        <ul>
          <li>
            Seu nome, o nome e o tipo (ou nicho) do seu negócio e a cidade;
          </li>
          <li>Seu número de WhatsApp;</li>
          <li>
            O plano, os módulos e a descrição do que você precisa, se escrever;
          </li>
          <li>A data e hora do envio e o seu aceite desta política.</li>
        </ul>
        <p>
          Não peço CPF, documentos, endereço nem dados de pagamento pelo site. A
          demonstração interativa usa apenas dados fictícios e nada do que você
          digita nela é enviado.
        </p>

        <h2>3. Pra que uso esses dados</h2>
        <ul>
          <li>Entrar em contato com você pelo WhatsApp sobre o seu pedido;</li>
          <li>Preparar a proposta e, se você contratar, criar o seu site.</li>
        </ul>
        <p>
          Não vendo, não alugo e não uso seus dados pra propaganda. A base legal
          é o seu consentimento (art. 7º, I) e a realização de procedimentos
          antes de um possível contrato, a seu pedido (art. 7º, V).
        </p>

        <h2>4. Onde os dados ficam e com quem são compartilhados</h2>
        <p>
          Uso serviços de terceiros pra o site funcionar, que podem guardar ou
          processar dados fora do Brasil:
        </p>
        <ul>
          <li>
            <b>Supabase</b>: banco de dados onde o pedido é salvo, com acesso
            restrito (o próprio site não consegue ler os pedidos depois de
            enviados);
          </li>
          <li>
            <b>Cloudflare</b>: hospedagem do site;
          </li>
          <li>
            <b>Google Fonts</b>: fontes do site (o navegador baixa as fontes dos
            servidores do Google);
          </li>
          <li>
            <b>WhatsApp (Meta)</b>: quando conversamos por lá.
          </li>
        </ul>

        <h2>5. Por quanto tempo guardo</h2>
        <p>
          Se não fecharmos negócio, os dados do pedido são apagados em até 12
          meses. Se você virar cliente, eles ficam enquanto durar o contrato e
          pelo tempo que a lei exigir depois.
        </p>

        <h2>6. Cookies e armazenamento no navegador</h2>
        <p>
          O site não usa cookies de propaganda nem de rastreamento. Ele só
          guarda no seu próprio navegador (localStorage e sessionStorage)
          pequenas preferências, como "já vi o aviso de privacidade" e "não
          mostrar mais as mensagens do botão do WhatsApp". Você pode apagar isso
          a qualquer momento nas configurações do navegador.
        </p>

        <h2>7. Seus direitos</h2>
        <p>A qualquer momento você pode pedir para:</p>
        <ul>
          <li>Confirmar se tenho dados seus e ver quais são;</li>
          <li>Corrigir dados errados ou desatualizados;</li>
          <li>Apagar seus dados ou retirar o seu consentimento;</li>
          <li>Saber com quem eles foram compartilhados.</li>
        </ul>
        <p>
          Basta me chamar no {contato}. Respondo em até 15 dias, como pede a
          lei.
        </p>

        <h2>8. Segurança</h2>
        <p>
          Os dados trafegam com criptografia (HTTPS), ficam num banco com regras
          de acesso conferidas no próprio servidor e só eu tenho acesso aos
          pedidos.
        </p>

        <h2>9. Mudanças nesta política</h2>
        <p>
          Se algo mudar, atualizo esta página e a data lá em cima. Mudanças
          importantes eu aviso pra quem estiver com pedido em andamento.
        </p>
      </main>

      <footer className="pv-rodape">
        <div className="container">
          © {new Date().getFullYear()} {nome} · {dono.nome}
        </div>
      </footer>
      <BannerCookies />
    </>
  )
}
