/*
 * Achei! — aplicação (SPA com rotas por hash).
 * Estado salvo no navegador (localStorage): loja escolhida, lista de compras,
 * último diagnóstico e chamados de especialista.
 */
(() => {
  const CHAVE = "achei-v1";
  const app = document.getElementById("app");

  // ------------------------------------------------------------------
  // Estado
  // ------------------------------------------------------------------
  function carregar() {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE));
      if (salvo && salvo.loja) return salvo;
    } catch (e) { /* armazenamento indisponível */ }
    return { loja: "tiete", lista: [], diagnostico: null, tickets: [], meuTicket: null, seq: 100 };
  }
  let estado = carregar();
  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) { /* segue em memória */ }
    atualizarBadge();
  }
  window.addEventListener("storage", (e) => {
    if (e.key === CHAVE) { estado = carregar(); render(); }
  });

  // ------------------------------------------------------------------
  // Utilitários
  // ------------------------------------------------------------------
  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reais = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const produto = (id) => PRODUTOS.find((p) => p.id === id);
  const problema = (id) => PROBLEMAS.find((p) => p.id === id);
  const lojaAtual = () => LOJAS.find((l) => l.id === estado.loja) || LOJAS[0];
  const idxLoja = () => Math.max(0, LOJAS.findIndex((l) => l.id === estado.loja));
  const estoque = (p) => p.estoque[idxLoja()];
  const icone = (p) => CATEGORIA_ICONE[p.categoria] || "📦";
  const minutos = (ms) => Math.max(0, Math.round(ms / 60000));

  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("mostrar");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove("mostrar"), 2400);
  }

  function atualizarBadge() {
    const b = document.getElementById("badge-lista");
    const qtd = estado.lista.filter((i) => !i.pego).length;
    b.textContent = qtd;
    b.hidden = qtd === 0;
    document.getElementById("btn-loja").textContent = "📍 " + lojaAtual().nome;
  }

  function adicionar(id, silencioso) {
    const item = estado.lista.find((i) => i.id === id);
    if (item) item.qtd += 1;
    else estado.lista.push({ id, qtd: 1, pego: false });
    salvar();
    if (!silencioso) toast("Adicionado à sua lista");
  }

  // ------------------------------------------------------------------
  // Componentes
  // ------------------------------------------------------------------
  function htmlEstoque(p) {
    const qtd = estoque(p);
    if (qtd === 0) {
      const outra = LOJAS.map((l, i) => ({ l, q: p.estoque[i] })).find((x) => x.q > 0);
      return `<div class="estoque zero">Esgotado nesta loja${outra ? ` · ${outra.q} un. na ${esc(outra.l.nome)}` : ""}</div>`;
    }
    if (qtd <= 10) return `<div class="estoque pouco">Últimas ${qtd} unidades nesta loja</div>`;
    return `<div class="estoque ok">✓ ${qtd} em estoque agora</div>`;
  }

  const htmlLocal = (p) => `<span class="local">📍 Corredor ${p.corredor} · Prateleira ${p.prateleira} · Nível ${p.nivel}</span>`;

  function cartaoProduto(p, opcional) {
    const naLista = estado.lista.some((i) => i.id === p.id);
    return `
      <div class="produto">
        <div class="ico" aria-hidden="true">${icone(p)}</div>
        <div>
          ${opcional ? '<div class="tag-opc">Opcional</div>' : ""}
          <h3><a href="#/produto/${p.id}">${esc(p.nome)}</a></h3>
          <div class="pequeno">${esc(p.simples)}</div>
          ${htmlLocal(p)}
          ${htmlEstoque(p)}
          <div class="linha-acao">
            <span class="preco">${reais(p.preco)}</span>
            <button class="btn peq ${naLista ? "sec" : ""}" data-add="${p.id}" ${estoque(p) === 0 ? "disabled" : ""}>
              ${naLista ? "✓ Na lista (+1)" : "+ Adicionar"}
            </button>
          </div>
        </div>
      </div>`;
  }

  // ------------------------------------------------------------------
  // Telas
  // ------------------------------------------------------------------
  function telaInicio() {
    const exemplos = ["Minha torneira tá pingando", "O chuveiro não esquenta", "Quero pintar meu quarto", "Tem mofo na parede do banheiro", "Preciso pendurar uma prateleira"];
    const aguardando = estado.tickets.filter((t) => t.loja === estado.loja && t.status !== "atendido").length;
    const setoresHtml = Object.entries(SETORES).map(([c, nome]) => `
      <a class="setor" href="#/setor/${c}"><b>${esc(nome)}</b><span>Corredor ${c}</span></a>`).join("");
    return `
      <section class="hero">
        <h1>O que você precisa resolver hoje?</h1>
        <p>Conte do seu jeito. A gente diz o que levar, onde está na loja e como fazer.</p>
        <form class="caixa-pergunta" id="form-pergunta">
          <label for="pergunta" class="pequeno" hidden>Descreva o problema</label>
          <textarea id="pergunta" rows="2" maxlength="200" placeholder="Ex.: a descarga não para de correr"></textarea>
          <button type="button" class="btn-icone btn-mic" id="btn-mic" aria-label="Falar em vez de digitar" title="Falar">🎤</button>
          <button type="submit" class="btn-icone btn-enviar" aria-label="Perguntar">➜</button>
        </form>
        <div class="chips">${exemplos.map((e) => `<button class="chip" data-exemplo="${esc(e)}">${esc(e)}</button>`).join("")}</div>
      </section>

      <div class="cartao status-loja">
        <div class="num">${aguardando}</div>
        <div><b>${aguardando === 1 ? "cliente aguardando" : "clientes aguardando"} um especialista</b>
          <div class="pequeno">Resolva sozinho com o Achei! ou <a href="#/especialista">chame alguém</a>. Espera estimada: ~${esperaEstimada()} min.</div></div>
      </div>

      <h2 class="titulo-sec">Ou procure por setor</h2>
      <div class="grade-setores">${setoresHtml}</div>
      <p class="rodape">Achei! · MVP do Challenge FIAP 2026 · Leroy Merlin. Preços e estoques fictícios. · <a href="#/vendedor">Área do vendedor</a></p>`;
  }

  function ligarInicio() {
    const form = document.getElementById("form-pergunta");
    const campo = document.getElementById("pergunta");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const texto = campo.value.trim();
      if (texto.length < 3) { toast("Escreva um pouco mais sobre o que precisa"); campo.focus(); return; }
      location.hash = "#/assistente?q=" + encodeURIComponent(texto);
    });
    campo.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
    });
    app.querySelectorAll("[data-exemplo]").forEach((b) =>
      b.addEventListener("click", () => { location.hash = "#/assistente?q=" + encodeURIComponent(b.dataset.exemplo); }));
    ligarVoz(document.getElementById("btn-mic"), campo, form);
  }

  /** Entrada por voz (Web Speech API), quando o navegador suporta. */
  function ligarVoz(botao, campo, form) {
    const Reconhecimento = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Reconhecimento) { botao.hidden = true; return; }
    botao.addEventListener("click", () => {
      const rec = new Reconhecimento();
      rec.lang = "pt-BR";
      rec.interimResults = false;
      botao.classList.add("ouvindo");
      rec.onresult = (e) => { campo.value = e.results[0][0].transcript; form.requestSubmit(); };
      rec.onerror = () => toast("Não consegui ouvir. Tente digitar.");
      rec.onend = () => botao.classList.remove("ouvindo");
      rec.start();
    });
  }

  function telaAssistente(params) {
    const pergunta = (params.get("q") || "").slice(0, 200);
    const pid = params.get("p");
    let resultados = IA.entender(pergunta);
    if (pid && problema(pid)) {
      resultados = [{ problema: problema(pid), confianca: 100 }, ...resultados.filter((r) => r.problema.id !== pid)];
    }
    const produtos = IA.buscarProdutos(pergunta, 8);
    const bolha = pergunta ? `<div class="pergunta-cliente">“${esc(pergunta)}”</div>` : "";

    const principal = resultados[0];
    const produtoForte = produtos.length && (!principal || principal.pontos < 3.5) && IA.normalizar(pergunta).split(" ").length <= 4;

    if (!principal || produtoForte) {
      if (produtos.length) {
        return `${bolha}
          <div class="cartao"><h2>Encontrei estes produtos</h2>
            <p class="sub">Com localização exata e estoque desta loja.</p>
            ${produtos.map((p) => cartaoProduto(p)).join("")}</div>
          ${principal ? `<a class="btn sec largo" href="#/assistente?q=${encodeURIComponent(pergunta)}&p=${principal.problema.id}">Ver também: ${esc(principal.problema.titulo)}</a>` : ""}`;
      }
      return `${bolha}
        <div class="cartao vazio"><div class="grande">🤔</div>
          <h2>Ainda não entendi esse problema</h2>
          <p>Tente contar de outro jeito (o que quebrou, em qual cômodo) ou fale com um especialista. Ele já vai receber o que você escreveu.</p>
          <div class="acoes" style="justify-content:center">
            <a class="btn" href="#/especialista?q=${encodeURIComponent(pergunta)}">🙋 Chamar especialista</a>
            <a class="btn sec" href="#/">Tentar de novo</a>
          </div></div>`;
    }

    const p = principal.problema;
    estado.diagnostico = { id: p.id, pergunta };
    salvar();

    const essenciais = p.essenciais.map(produto);
    const opcionais = p.opcionais.map(produto);
    const totalEssenciais = essenciais.reduce((s, x) => s + x.preco, 0);
    const termos = Object.entries(p.termos || {}).map(([t, d]) =>
      `<details class="termo"><summary>${esc(t)}</summary><p>${esc(d)}</p></details>`).join("");
    const outros = resultados.slice(1, 3).filter((r) => r.pontos >= 3.5);

    return `${bolha}
      <div class="cartao">
        <div class="diag-topo">
          <div><div class="pequeno">Parece que é:</div><h1 style="font-size:1.4rem">${esc(p.titulo)}</h1></div>
          <span class="confianca">${principal.confianca}% de certeza</span>
        </div>
        <p>${esc(p.resumo)}</p>
        <div class="metas"><span class="meta">🛠️ ${esc(p.dificuldade)}</span><span class="meta">⏱️ ${esc(p.tempo)}</span><span class="meta">💰 ${reais(totalEssenciais)} no essencial</span></div>
        <div class="aviso-seg">⚠️ ${esc(p.seguranca)}</div>
        <button class="btn lima largo" id="btn-tudo">🗺️ Adicionar o essencial e montar minha rota</button>
      </div>

      <div class="duas-col">
        <div class="cartao">
          <h2>O que levar</h2>
          ${essenciais.map((x) => cartaoProduto(x)).join("")}
          ${opcionais.map((x) => cartaoProduto(x, true)).join("")}
        </div>
        <div>
          <div class="cartao"><h2>Como fazer</h2><ol class="passos">${p.passos.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></div>
          ${termos ? `<div class="cartao"><h2>Palavras técnicas, em português claro</h2><p class="sub" style="margin-bottom:10px">Toque para entender o que o vendedor quer dizer.</p>${termos}</div>` : ""}
          <div class="cartao"><h2>Ainda com dúvida?</h2>
            <p class="sub">Um especialista de ${esc(SETORES[p.setor])} vem até você já sabendo do seu problema.</p>
            <a class="btn sec largo" style="margin-top:12px" href="#/especialista">🙋 Chamar especialista</a></div>
          ${outros.length ? `<div class="cartao"><h2>Não é isso?</h2>${outros.map((r) =>
            `<a class="btn sec peq" style="margin:8px 8px 0 0" href="#/assistente?q=${encodeURIComponent(pergunta)}&p=${r.problema.id}">${esc(r.problema.titulo)}</a>`).join("")}</div>` : ""}
        </div>
      </div>`;
  }

  function ligarAssistente() {
    const botao = document.getElementById("btn-tudo");
    if (!botao || !estado.diagnostico) return;
    botao.addEventListener("click", () => {
      const p = problema(estado.diagnostico.id);
      let adicionados = 0;
      p.essenciais.forEach((id) => {
        if (estoque(produto(id)) > 0 && !estado.lista.some((i) => i.id === id)) { adicionar(id, true); adicionados++; }
      });
      toast(adicionados ? `${adicionados} itens adicionados. Montando sua rota...` : "Os itens já estavam na sua lista");
      setTimeout(() => { location.hash = "#/rota"; }, 500);
    });
  }

  function telaProduto(id) {
    const p = produto(id);
    if (!p) return `<div class="cartao vazio"><div class="grande">🔎</div><h2>Produto não encontrado</h2><a class="btn" href="#/">Voltar ao início</a></div>`;
    const relacionados = PROBLEMAS.filter((pr) => pr.essenciais.includes(id) || pr.opcionais.includes(id));
    return `
      <div class="cartao">
        <div style="font-size:3rem" aria-hidden="true">${icone(p)}</div>
        <div class="pequeno">${esc(p.categoria)} · cód. ${p.id}</div>
        <h1 style="font-size:1.35rem;margin-top:4px">${esc(p.nome)}</h1>
        <p>${esc(p.simples)}</p>
        <div class="preco" style="font-size:1.5rem;font-weight:800;color:var(--verde)">${reais(p.preco)}</div>
        ${htmlLocal(p)}
        ${htmlEstoque(p)}
        <div class="acoes">
          <button class="btn" data-add="${p.id}" ${estoque(p) === 0 ? "disabled" : ""}>+ Adicionar à lista</button>
          <a class="btn sec" href="#/rota?foco=${p.id}">🗺️ Me leve até ele</a>
        </div>
      </div>
      <div class="cartao"><h2>Onde fica</h2><p class="sub">${esc(SETORES[p.corredor])} — corredor ${p.corredor}, prateleira ${p.prateleira}, ${p.nivel}º nível de baixo para cima.</p>
        <div class="mapa-wrap" style="margin-top:12px">${mapaSVG([p], p.id)}</div></div>
      ${relacionados.length ? `<div class="cartao"><h2>Usado para</h2>${relacionados.map((r) =>
        `<a class="btn sec peq" style="margin:8px 8px 0 0" href="#/assistente?q=${encodeURIComponent(r.titulo)}&p=${r.id}">${esc(r.titulo)}</a>`).join("")}</div>` : ""}`;
  }

  function telaSetor(corredor) {
    const c = Number(corredor);
    const itens = PRODUTOS.filter((p) => p.corredor === c);
    return `
      <div class="cartao">
        <div class="pequeno">Corredor ${c}</div>
        <h1 style="font-size:1.4rem">${esc(SETORES[c] || "Setor")}</h1>
        ${itens.length ? itens.map((p) => cartaoProduto(p)).join("") : '<p class="sub">Nenhum produto deste corredor no MVP.</p>'}
      </div>`;
  }

  function telaLista() {
    if (!estado.lista.length) {
      return `<div class="cartao vazio"><div class="grande">📝</div><h2>Sua lista está vazia</h2>
        <p>Conte o que você precisa resolver e a gente monta a lista para você.</p>
        <a class="btn" href="#/">Começar</a></div>`;
    }
    const total = estado.lista.reduce((s, i) => s + produto(i.id).preco * i.qtd, 0);
    const faltam = estado.lista.filter((i) => !i.pego).length;
    return `
      <div class="cartao">
        <h1 style="font-size:1.35rem">Minha lista</h1>
        <p class="sub">${faltam ? `${faltam} ${faltam === 1 ? "item" : "itens"} para pegar` : "Tudo pego! Pode ir para o caixa."}</p>
        <div style="margin-top:8px">
        ${estado.lista.map((i) => {
          const p = produto(i.id);
          return `<div class="item-lista ${i.pego ? "pego" : ""}">
            <input type="checkbox" data-pego="${p.id}" ${i.pego ? "checked" : ""} aria-label="Marcar ${esc(p.nome)} como pego">
            <div><div class="nome"><b>${esc(p.nome)}</b></div><div class="pequeno">Corredor ${p.corredor} · Prat. ${p.prateleira} · ${reais(p.preco)}</div></div>
            <div class="qtd"><button data-menos="${p.id}" aria-label="Diminuir">−</button><span>${i.qtd}</span><button data-mais="${p.id}" aria-label="Aumentar">+</button></div>
          </div>`;
        }).join("")}
        </div>
        <div class="total"><span>Total estimado</span><span>${reais(total)}</span></div>
        <div class="acoes"><a class="btn lima" href="#/rota">🗺️ Ver rota na loja</a><button class="btn perigo" id="btn-limpar">Limpar lista</button></div>
      </div>`;
  }

  function ligarLista() {
    app.querySelectorAll("[data-pego]").forEach((c) => c.addEventListener("change", () => {
      const i = estado.lista.find((x) => x.id === c.dataset.pego);
      i.pego = c.checked; salvar(); render();
    }));
    app.querySelectorAll("[data-mais]").forEach((b) => b.addEventListener("click", () => {
      estado.lista.find((x) => x.id === b.dataset.mais).qtd++; salvar(); render();
    }));
    app.querySelectorAll("[data-menos]").forEach((b) => b.addEventListener("click", () => {
      const i = estado.lista.find((x) => x.id === b.dataset.menos);
      i.qtd--;
      if (i.qtd <= 0) estado.lista = estado.lista.filter((x) => x !== i);
      salvar(); render();
    }));
    const limpar = document.getElementById("btn-limpar");
    if (limpar) limpar.addEventListener("click", () => { estado.lista = []; salvar(); render(); toast("Lista limpa"); });
  }

  // ------------------------------------------------------------------
  // Mapa da loja e rota
  // ------------------------------------------------------------------
  const MAPA = { colX: 60, passo: 80, larg: 46, topoY: 60, baseY: 330, alt: 170, corredorY: 285, entrada: { x: 450, y: 560 }, caixa: { x: 800, y: 560 } };

  function pontoProduto(p) {
    const col = (p.corredor - 1) % 10;
    const cima = p.corredor <= 10;
    const x = MAPA.colX + col * MAPA.passo + MAPA.larg + 17;
    const ordem = "ABCD".indexOf(p.prateleira);
    const y0 = cima ? MAPA.topoY : MAPA.baseY;
    return { x, y: Math.round(y0 + (ordem + 0.5) * (MAPA.alt / 4)) };
  }

  /**
   * Ordena as paradas: como o caixa fica à direita da entrada, o caminho mais
   * curto é ir até o corredor mais à esquerda e varrer a loja até o caixa,
   * sem voltar. No mesmo corredor, a fileira de cima vem antes.
   */
  function ordenarRota(itens) {
    return itens
      .map((p) => ({ p, pt: pontoProduto(p) }))
      .sort((a, b) => a.pt.x - b.pt.x || a.pt.y - b.pt.y);
  }

  function caminho(rota) {
    const pts = [MAPA.entrada, { x: MAPA.entrada.x, y: MAPA.corredorY }];
    let atual = pts[1];
    for (const { pt } of rota) {
      pts.push({ x: pt.x, y: MAPA.corredorY }, pt, { x: pt.x, y: MAPA.corredorY });
      atual = { x: pt.x, y: MAPA.corredorY };
    }
    pts.push({ x: 870, y: atual.y }, { x: 870, y: MAPA.caixa.y - 20 }, { x: MAPA.caixa.x, y: MAPA.caixa.y - 20 });
    return pts.map((p) => `${p.x},${p.y}`).join(" ");
  }

  function mapaSVG(itens, foco, pegos) {
    const rota = ordenarRota(itens);
    let gondolas = "";
    for (let c = 1; c <= 20; c++) {
      const col = (c - 1) % 10;
      const x = MAPA.colX + col * MAPA.passo;
      const y = c <= 10 ? MAPA.topoY : MAPA.baseY;
      const ativo = itens.some((p) => p.corredor === c);
      gondolas += `<g><title>Corredor ${c} · ${esc(SETORES[c])}</title>
        <rect x="${x}" y="${y}" width="${MAPA.larg}" height="${MAPA.alt}" rx="6" fill="${ativo ? "#CFE9BD" : "#E6ECE8"}" stroke="${ativo ? "#1F7A50" : "#C8D3CC"}" stroke-width="${ativo ? 2 : 1}"/>
        <text x="${x + MAPA.larg / 2}" y="${y + MAPA.alt / 2 + 6}" text-anchor="middle" font-size="17" font-weight="800" fill="${ativo ? "#16553A" : "#8A9A91"}">${c}</text></g>`;
    }
    const paradas = rota.map(({ p, pt }, i) => {
      const pego = pegos && pegos.has(p.id);
      const cor = pego ? "#A7B5AD" : p.id === foco ? "#B3261E" : "#16553A";
      return `<g><title>${esc(p.nome)}</title><circle cx="${pt.x}" cy="${pt.y}" r="13" fill="${cor}" stroke="#fff" stroke-width="3"/>
        <text x="${pt.x}" y="${pt.y + 5}" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">${i + 1}</text></g>`;
    }).join("");
    return `<svg viewBox="0 0 920 600" role="img" aria-label="Mapa da loja com a rota até ${itens.length} produto(s)">
      <rect x="20" y="20" width="880" height="560" rx="18" fill="#FAFCFA" stroke="#B9C7BF" stroke-width="2"/>
      <rect x="40" y="${MAPA.corredorY - 22}" width="840" height="44" rx="10" fill="#F0F4F1"/>
      <text x="460" y="${MAPA.corredorY + 5}" text-anchor="middle" font-size="12" fill="#8A9A91" font-weight="700" letter-spacing="3">CORREDOR CENTRAL</text>
      ${gondolas}
      <rect x="40" y="525" width="170" height="40" rx="8" fill="#FFF1C9"/><text x="125" y="550" text-anchor="middle" font-size="13" font-weight="700" fill="#8A5A00">🙋 Especialistas</text>
      <rect x="720" y="525" width="160" height="40" rx="8" fill="#E6ECE8"/><text x="800" y="550" text-anchor="middle" font-size="13" font-weight="700" fill="#5B6B62">🛒 Caixas</text>
      <rect x="400" y="560" width="100" height="20" fill="#7BC74D"/><text x="450" y="575" text-anchor="middle" font-size="12" font-weight="800" fill="#16553A">ENTRADA</text>
      ${itens.length ? `<polyline points="${caminho(rota)}" fill="none" stroke="#1F7A50" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="rota-linha" opacity=".85"/>` : ""}
      <circle cx="${MAPA.entrada.x}" cy="${MAPA.entrada.y - 18}" r="10" fill="#7BC74D" stroke="#16553A" stroke-width="3"/>
      <text x="${MAPA.entrada.x + 18}" y="${MAPA.entrada.y - 26}" font-size="12" font-weight="700" fill="#16553A">Você está aqui</text>
      ${paradas}
    </svg>`;
  }

  function telaRota(params) {
    const foco = params.get("foco");
    let itens;
    if (foco && produto(foco)) itens = [produto(foco)];
    else itens = estado.lista.map((i) => produto(i.id));
    if (!itens.length) {
      return `<div class="cartao vazio"><div class="grande">🗺️</div><h2>Nada para mostrar no mapa ainda</h2>
        <p>Adicione produtos à sua lista e a gente monta o caminho mais curto pela loja.</p><a class="btn" href="#/">Começar</a></div>`;
    }
    const pegos = new Set(estado.lista.filter((i) => i.pego).map((i) => i.id));
    const rota = ordenarRota(itens);
    const faltam = rota.filter(({ p }) => !pegos.has(p.id)).length;
    return `
      <div class="cartao" style="padding-bottom:10px">
        <h1 style="font-size:1.35rem">${foco ? "Caminho até o produto" : "Sua rota na loja"}</h1>
        <p class="sub">${foco ? esc(produto(foco).nome) : `${rota.length} paradas na ordem mais curta, da entrada até o caixa. ${faltam ? `Faltam ${faltam}.` : "Tudo pego!"}`}</p>
      </div>
      <div class="mapa-wrap">${mapaSVG(itens, foco, pegos)}
        <div class="legenda"><span>🟢 Corredores com itens da sua lista</span><span>➖ Caminho sugerido</span><span>Toque em ✓ quando pegar o item</span></div></div>
      <div class="cartao" style="margin-top:16px">
        ${rota.map(({ p }, i) => `
          <div class="parada ${pegos.has(p.id) ? "pego" : ""}">
            <div class="num-parada">${i + 1}</div>
            <div><div class="nome"><b>${esc(p.nome)}</b></div><div class="pequeno">Corredor ${p.corredor} (${esc(SETORES[p.corredor])}) · Prateleira ${p.prateleira} · Nível ${p.nivel}</div></div>
            ${foco ? "" : `<button class="btn peq ${pegos.has(p.id) ? "sec" : ""}" data-pegar="${p.id}">${pegos.has(p.id) ? "Desfazer" : "✓ Peguei"}</button>`}
          </div>`).join("")}
        <div class="acoes"><a class="btn sec" href="#/especialista">🙋 Preciso de ajuda aqui</a>${foco ? `<button class="btn" data-add="${foco}">+ Adicionar à lista</button>` : ""}</div>
      </div>`;
  }

  function ligarRota() {
    app.querySelectorAll("[data-pegar]").forEach((b) => b.addEventListener("click", () => {
      const i = estado.lista.find((x) => x.id === b.dataset.pegar);
      if (i) { i.pego = !i.pego; salvar(); render(); if (i.pego) toast("Boa! Próxima parada no mapa"); }
    }));
  }

  // ------------------------------------------------------------------
  // Especialista (cliente) e painel do vendedor
  // ------------------------------------------------------------------
  function esperaEstimada() {
    const fila = estado.tickets.filter((t) => t.loja === estado.loja && t.status === "aguardando").length;
    return Math.max(2, fila * 4 + 2);
  }

  function telaEspecialista(params) {
    const meu = estado.tickets.find((t) => t.id === estado.meuTicket);
    if (meu && meu.status !== "atendido") return telaMeuTicket(meu);

    const d = estado.diagnostico;
    const texto = params.get("q") || (d ? d.pergunta : "");
    const itensLista = estado.lista.filter((i) => !i.pego).map((i) => produto(i.id));
    const corredorSugerido = itensLista.length ? itensLista[0].corredor : d ? problema(d.id).setor : "";
    return `
      <div class="cartao">
        <h1 style="font-size:1.35rem">Chamar um especialista</h1>
        <p class="sub">O vendedor recebe seu problema, sua lista e onde você está. Ele chega sabendo do que se trata.</p>
        <form id="form-chamado" novalidate>
          <label class="campo" for="c-nome">Seu primeiro nome</label>
          <input class="entrada" id="c-nome" maxlength="30" autocomplete="given-name" placeholder="Ex.: Marta">
          <div class="erro-campo" id="e-nome"></div>
          <label class="campo" for="c-problema">O que você precisa?</label>
          <textarea class="entrada" id="c-problema" rows="3" maxlength="200">${esc(texto)}</textarea>
          <div class="erro-campo" id="e-problema"></div>
          <label class="campo" for="c-corredor">Em qual corredor você está?</label>
          <select class="entrada" id="c-corredor">
            <option value="">Escolha...</option>
            ${Object.entries(SETORES).map(([c, n]) => `<option value="${c}" ${String(corredorSugerido) === c ? "selected" : ""}>Corredor ${c} · ${esc(n)}</option>`).join("")}
          </select>
          <div class="erro-campo" id="e-corredor"></div>
          ${d ? `<p class="pequeno" style="margin-top:10px">🤖 O diagnóstico do assistente (“${esc(problema(d.id).titulo)}”) vai junto.</p>` : ""}
          ${itensLista.length ? `<p class="pequeno">📝 Sua lista com ${itensLista.length} ${itensLista.length === 1 ? "item" : "itens"} também vai junto.</p>` : ""}
          <button class="btn largo" style="margin-top:14px" type="submit">🙋 Chamar agora · espera ~${esperaEstimada()} min</button>
        </form>
      </div>`;
  }

  function ligarEspecialista() {
    const form = document.getElementById("form-chamado");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = document.getElementById("c-nome").value.trim();
      const texto = document.getElementById("c-problema").value.trim();
      const corredor = document.getElementById("c-corredor").value;
      let ok = true;
      const erro = (id, msg) => { document.getElementById(id).textContent = msg; if (msg) ok = false; };
      erro("e-nome", /^[A-Za-zÀ-ÿ' ]{2,30}$/.test(nome) ? "" : "Digite seu primeiro nome (só letras).");
      erro("e-problema", texto.length >= 5 ? "" : "Conte em poucas palavras o que você precisa.");
      erro("e-corredor", corredor ? "" : "Escolha o corredor para o vendedor te achar.");
      if (!ok) return;

      estado.seq = (estado.seq || 100) + 1;
      const d = estado.diagnostico;
      const ticket = {
        id: "T" + Date.now(), codigo: "A" + estado.seq, loja: estado.loja, nome, texto,
        corredor: Number(corredor), diagnostico: d ? problema(d.id).titulo : null,
        itens: estado.lista.filter((i) => !i.pego).map((i) => produto(i.id).nome),
        criado: Date.now(), status: "aguardando", vendedor: null,
      };
      estado.tickets.push(ticket);
      estado.meuTicket = ticket.id;
      salvar();
      render();
      toast("Chamado enviado! Fique por perto do corredor " + corredor);
    });
  }

  function telaMeuTicket(t) {
    const fila = estado.tickets.filter((x) => x.loja === t.loja && x.status === "aguardando" && x.criado < t.criado).length;
    const etapa = { aguardando: 1, a_caminho: 2, atendido: 3 }[t.status];
    return `
      <div class="cartao ticket">
        <div class="pequeno">Sua senha</div>
        <div class="codigo">${esc(t.codigo)}</div>
        <p style="margin:4px 0 0"><b>${t.status === "aguardando" ? (fila ? `${fila} ${fila === 1 ? "pessoa" : "pessoas"} na sua frente · ~${fila * 4 + 2} min` : "Você é o próximo!") : `${esc(t.vendedor)} está indo até você`}</b></p>
        <p class="sub">Aguarde no corredor ${t.corredor} (${esc(SETORES[t.corredor])}). Enquanto isso, pode continuar usando o Achei!</p>
        <div class="etapas">
          <div class="etapa feita"><i>✓</i>Enviado</div>
          <div class="etapa ${etapa >= 2 ? "feita" : ""}"><i>${etapa >= 2 ? "✓" : "2"}</i>A caminho</div>
          <div class="etapa ${etapa >= 3 ? "feita" : ""}"><i>${etapa >= 3 ? "✓" : "3"}</i>Atendido</div>
        </div>
        <div class="acoes" style="justify-content:center"><button class="btn perigo peq" id="btn-cancelar">Cancelar chamado</button></div>
      </div>`;
  }

  function ligarMeuTicket() {
    const b = document.getElementById("btn-cancelar");
    if (b) b.addEventListener("click", () => {
      estado.tickets = estado.tickets.filter((t) => t.id !== estado.meuTicket);
      estado.meuTicket = null; salvar(); render(); toast("Chamado cancelado");
    });
  }

  function telaVendedor() {
    const daLoja = estado.tickets.filter((t) => t.loja === estado.loja);
    const abertos = daLoja.filter((t) => t.status !== "atendido").sort((a, b) => a.criado - b.criado);
    const atendidos = daLoja.filter((t) => t.status === "atendido").slice(-5).reverse();
    const aguardando = abertos.filter((t) => t.status === "aguardando");
    const esperaMedia = aguardando.length ? Math.round(aguardando.reduce((s, t) => s + minutos(Date.now() - t.criado), 0) / aguardando.length) : 0;
    const card = (t) => `
      <div class="cartao chamado ${t.status}">
        <div class="cab"><h2 style="font-size:1.1rem">${esc(t.codigo)} · ${esc(t.nome)}</h2><span class="status ${t.status}">${t.status.replace("_", " ")}</span></div>
        <p class="pequeno">📍 Corredor ${t.corredor} · ${esc(SETORES[t.corredor])} · há ${minutos(Date.now() - t.criado)} min</p>
        <p style="margin:6px 0">“${esc(t.texto)}”</p>
        ${t.diagnostico ? `<p class="pequeno">🤖 Assistente identificou: <b>${esc(t.diagnostico)}</b></p>` : ""}
        ${t.itens.length ? `<p class="pequeno">📝 Lista do cliente: ${t.itens.map(esc).join(", ")}</p>` : ""}
        <div class="acoes">
          ${t.status === "aguardando" ? `<button class="btn peq" data-assumir="${t.id}">Assumir e ir até o cliente</button>` : ""}
          ${t.status === "a_caminho" ? `<button class="btn peq" data-concluir="${t.id}">Marcar como atendido</button>` : ""}
        </div>
      </div>`;
    return `
      <div class="cartao" style="background:var(--tinta);color:#fff;border:0">
        <div class="pequeno" style="color:#B9C7BF">Painel do vendedor · ${esc(lojaAtual().nome)}</div>
        <h1 style="font-size:1.35rem">Chamados de clientes</h1>
        <p class="pequeno" style="color:#B9C7BF">Atualiza sozinho. Para testar, abra o Achei! em outra aba e chame um especialista.</p>
      </div>
      <div class="kpis">
        <div class="kpi"><b>${aguardando.length}</b><span>aguardando</span></div>
        <div class="kpi"><b>${abertos.length - aguardando.length}</b><span>a caminho</span></div>
        <div class="kpi"><b>${esperaMedia} min</b><span>espera média</span></div>
      </div>
      <label class="campo" for="v-nome">Seu nome (vendedor)</label>
      <input class="entrada" id="v-nome" maxlength="30" value="${esc(estado.vendedor || "Carlos · Hidráulica")}" style="margin-bottom:14px">
      ${abertos.length ? abertos.map(card).join("") : `<div class="cartao vazio"><div class="grande">☕</div><p>Nenhum cliente aguardando agora.</p></div>`}
      ${atendidos.length ? `<h2 class="titulo-sec">Atendidos recentemente</h2>${atendidos.map(card).join("")}` : ""}`;
  }

  function ligarVendedor() {
    const nome = document.getElementById("v-nome");
    nome.addEventListener("change", () => { estado.vendedor = nome.value.trim() || "Vendedor"; salvar(); });
    const mudar = (id, status) => {
      const t = estado.tickets.find((x) => x.id === id);
      if (!t) return;
      t.status = status;
      if (status === "a_caminho") t.vendedor = (nome.value.trim() || "Vendedor").split("·")[0].trim();
      salvar(); render();
    };
    app.querySelectorAll("[data-assumir]").forEach((b) => b.addEventListener("click", () => { mudar(b.dataset.assumir, "a_caminho"); toast("Cliente avisado que você está a caminho"); }));
    app.querySelectorAll("[data-concluir]").forEach((b) => b.addEventListener("click", () => { mudar(b.dataset.concluir, "atendido"); toast("Atendimento concluído"); }));
  }

  // ------------------------------------------------------------------
  // Roteador
  // ------------------------------------------------------------------
  function rotaAtual() {
    const hash = location.hash.replace(/^#/, "") || "/";
    const [caminhoRota, query] = hash.split("?");
    return { partes: caminhoRota.split("/").filter(Boolean), params: new URLSearchParams(query || "") };
  }

  function render() {
    const { partes, params } = rotaAtual();
    const nome = partes[0] || "inicio";
    let html, ligar = () => {};
    switch (nome) {
      case "assistente": html = telaAssistente(params); ligar = ligarAssistente; break;
      case "produto": html = telaProduto(partes[1]); break;
      case "setor": html = telaSetor(partes[1]); break;
      case "lista": html = telaLista(); ligar = ligarLista; break;
      case "rota": html = telaRota(params); ligar = ligarRota; break;
      case "especialista": html = telaEspecialista(params); ligar = () => { ligarEspecialista(); ligarMeuTicket(); }; break;
      case "vendedor": html = telaVendedor(); ligar = ligarVendedor; break;
      default: html = telaInicio(); ligar = ligarInicio;
    }
    app.innerHTML = html;
    app.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => { adicionar(b.dataset.add); render(); }));
    ligar();
    document.querySelectorAll(".navbar a").forEach((a) =>
      a.classList.toggle("ativo", a.dataset.rota === (nome === "inicio" || !partes[0] ? "inicio" : nome)));
    atualizarBadge();
  }

  window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); app.focus({ preventScroll: true }); });

  // atualização ao vivo de chamados (cliente e vendedor)
  setInterval(() => {
    const { partes } = rotaAtual();
    if (partes[0] === "vendedor" || partes[0] === "especialista") {
      const antes = JSON.stringify(estado.tickets);
      estado = carregar();
      if (antes !== JSON.stringify(estado.tickets) || partes[0] === "vendedor") {
        const foco = document.activeElement && document.activeElement.id;
        if (!foco || !foco.startsWith("v-") && !foco.startsWith("c-")) render();
      }
    }
  }, 3000);

  // seletor de loja
  const dlg = document.getElementById("dlg-loja");
  document.getElementById("btn-loja").addEventListener("click", () => {
    document.getElementById("lista-lojas").innerHTML = LOJAS.map((l) =>
      `<button type="button" data-loja="${l.id}" class="${l.id === estado.loja ? "atual" : ""}"><b>${esc(l.nome)}</b><br><span class="pequeno">${esc(l.cidade)}</span></button>`).join("");
    dlg.querySelectorAll("[data-loja]").forEach((b) => b.addEventListener("click", () => {
      estado.loja = b.dataset.loja; salvar(); dlg.close(); render(); toast("Loja: " + lojaAtual().nome);
    }));
    if (dlg.showModal) dlg.showModal();
  });

  render();
})();
