/*
 * Achei! — motor de linguagem natural do assistente (roda no navegador).
 *
 * 1. Normaliza a frase (minúsculas, sem acento, sem pontuação).
 * 2. Expande sinônimos e gírias ("tá pingando" -> pinga, "privada" -> vaso).
 * 3. Compara com a base de problemas por radical e tolera erros de digitação
 *    (distância de edição), dando mais peso às palavras-chave fortes.
 * 4. Se não reconhecer um problema, faz busca direta no catálogo.
 *
 * No produto final, esta camada seria trocada por um modelo de linguagem
 * (ex.: Gemini) com busca por embeddings no catálogo real da loja.
 */
const IA = (() => {
  const STOP = new Set(("a o e de da do das dos em no na nos nas um uma uns umas que pra para por com sem meu minha " +
    "meus minhas esta esse essa isso ta tá to tô estou eu voce ele ela se nao muito mais quero preciso queria " +
    "como faz fazer tem tenho ai aqui la ja so foi vai ir ser ter mas ou qual quais onde").split(" "));

  // gírias e sinônimos -> termo que existe na base
  const SINONIMOS = {
    privada: "vaso sanitario", latrina: "vaso sanitario", bacia: "vaso sanitario", patente: "vaso sanitario",
    goteira: "pinga", gotejar: "pinga", pingar: "pinga", pingo: "pinga", escorrendo: "vaza", vazar: "vaza",
    entupi: "entupido", entupimento: "entupido", travado: "entupido", gelado: "frio", morno: "frio",
    lampada: "lampada", luz: "lampada", luzes: "lampada", bocal: "lampada",
    tomadas: "tomada", plug: "tomada", choque: "tomada",
    bolor: "mofo", fungo: "mofo", manchas: "mofo", manchado: "mofo", umido: "umidade", infiltrando: "infiltracao",
    pendurar: "pendurar", furo: "furar", furacao: "furar", parafusar: "fixar", nicho: "prateleira", estante: "prateleira",
    rangendo: "range", rangido: "range", barulhenta: "range", emperrou: "emperrada", travada: "emperrada",
    pinto: "pintar", pintando: "pintar", repintar: "pintar", tingir: "pintar",
    ladrilho: "azulejo", pastilhas: "pastilha",
    hortinha: "horta", tempero: "temperos", plantinha: "plantar", plantas: "plantar",
    estourado: "estourou", rachado: "rachou", trincado: "rachou",
  };

  function normalizar(texto) {
    return (texto || "")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokens(texto) {
    const base = normalizar(texto).split(" ").filter((t) => t && !STOP.has(t));
    const saida = [];
    for (const t of base) {
      saida.push(t);
      const sin = SINONIMOS[t];
      if (sin) saida.push(...sin.split(" "));
    }
    return saida;
  }

  // distância de Levenshtein com limite (para erros de digitação)
  function distancia(a, b, limite) {
    if (Math.abs(a.length - b.length) > limite) return limite + 1;
    let anterior = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const atual = [i];
      let menor = i;
      for (let j = 1; j <= b.length; j++) {
        const custo = a[i - 1] === b[j - 1] ? 0 : 1;
        atual[j] = Math.min(anterior[j] + 1, atual[j - 1] + 1, anterior[j - 1] + custo);
        menor = Math.min(menor, atual[j]);
      }
      if (menor > limite) return limite + 1;
      anterior = atual;
    }
    return anterior[b.length];
  }

  // a palavra digitada "bate" com a palavra-chave?
  function combina(token, chave) {
    if (token === chave) return 1;
    const raiz = Math.min(token.length, chave.length, 5);
    if (raiz >= 4 && token.slice(0, raiz) === chave.slice(0, raiz)) return 0.9; // mesmo radical
    if (chave.length >= 5 && distancia(token, chave, 1) <= 1) return 0.8; // 1 erro de digitação
    if (chave.length >= 8 && distancia(token, chave, 2) <= 2) return 0.7; // 2 erros em palavras longas
    return 0;
  }

  function pontuarChaves(toks, frase, chaves, peso) {
    let total = 0;
    const achadas = [];
    for (const chave of chaves) {
      if (chave.includes(" ")) {
        if (frase.includes(chave)) { total += peso * 1.2; achadas.push(chave); }
        continue;
      }
      let melhor = 0;
      for (const t of toks) melhor = Math.max(melhor, combina(t, chave));
      if (melhor > 0) { total += peso * melhor; achadas.push(chave); }
    }
    return { total, achadas };
  }

  /** Reconhece o problema descrito pelo cliente. Retorna a lista ordenada por confiança. */
  function entender(frase) {
    const toks = tokens(frase);
    const fraseNorm = " " + toks.join(" ") + " ";
    const resultados = PROBLEMAS.map((p) => {
      const forte = pontuarChaves(toks, fraseNorm, p.fortes, 3);
      const apoio = pontuarChaves(toks, fraseNorm, p.apoio, 1);
      const pontos = forte.total + (forte.total > 0 ? apoio.total : apoio.total * 0.3);
      return { problema: p, pontos, chaves: [...forte.achadas, ...apoio.achadas] };
    })
      .filter((r) => r.pontos >= 2.9)
      .sort((a, b) => b.pontos - a.pontos);

    const maior = resultados.length ? resultados[0].pontos : 0;
    return resultados.map((r) => ({
      ...r,
      confianca: Math.min(99, Math.round(55 + (r.pontos / Math.max(maior, 1)) * 30 + Math.min(r.pontos, 10) * 1.4)),
    }));
  }

  /** Busca direta de produtos por nome, categoria e etiquetas (tolerante a erros). */
  function buscarProdutos(frase, limite = 12) {
    const toks = tokens(frase);
    if (!toks.length) return [];
    return PRODUTOS.map((p) => {
      const palavras = normalizar(p.nome + " " + p.tags + " " + p.categoria).split(" ");
      let pontos = 0;
      for (const t of toks) {
        let melhor = 0;
        for (const w of palavras) melhor = Math.max(melhor, combina(t, w));
        pontos += melhor;
      }
      return { produto: p, pontos: pontos / toks.length };
    })
      .filter((r) => r.pontos >= 0.6)
      .sort((a, b) => b.pontos - a.pontos)
      .slice(0, limite)
      .map((r) => r.produto);
  }

  return { entender, buscarProdutos, normalizar };
})();
