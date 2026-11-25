/*
 * Achei! — dados do MVP (catálogo, mapa da loja e base de conhecimento).
 * Preços, estoques e localizações são fictícios, criados para demonstração.
 */

const LOJAS = [
  { id: "tiete", nome: "Loja Marginal Tietê", cidade: "São Paulo - SP" },
  { id: "raposo", nome: "Loja Raposo Tavares", cidade: "São Paulo - SP" },
];

/* Corredores: 1 a 10 na fileira de cima, 11 a 20 na de baixo. */
const SETORES = {
  1: "Hidráulica", 2: "Conexões e tubos", 3: "Banheiro", 4: "Cozinha e lavanderia", 5: "Elétrica",
  6: "Fios e disjuntores", 7: "Iluminação", 8: "Ferramentas manuais", 9: "Ferramentas elétricas", 10: "Ferragens e fixação",
  11: "Tintas", 12: "Acessórios de pintura", 13: "Construção e impermeabilização", 14: "Pisos", 15: "Revestimentos e rejuntes",
  16: "Madeiras e prateleiras", 17: "Organização", 18: "Jardim", 19: "Decoração", 20: "Portas e fechaduras",
};

const CATEGORIA_ICONE = {
  "Hidráulica": "🚰", "Banheiro": "🚽", "Elétrica": "🔌", "Iluminação": "💡", "Ferramentas": "🔧",
  "Fixação": "🔩", "Pintura": "🎨", "Construção": "🧱", "Revestimentos": "🧩", "Madeiras": "🪵",
  "Jardim": "🌱", "Portas": "🚪", "Limpeza": "🧽",
};

/* estoque: [Tietê, Raposo] */
const PRODUTOS = [
  // Hidráulica (1, 2, 3, 4)
  { id: "P001", nome: "Reparo vedante para torneira 1/2\"", categoria: "Hidráulica", preco: 12.9, corredor: 1, prateleira: "B", nivel: 2, estoque: [42, 18], tags: "reparo vedante torneira borracha cunha mecanismo", simples: "Peça de borracha que fica dentro da torneira e para o vazamento." },
  { id: "P002", nome: "Fita veda-rosca 18 mm x 25 m", categoria: "Hidráulica", preco: 6.5, corredor: 2, prateleira: "A", nivel: 3, estoque: [120, 64], tags: "fita veda rosca teflon vedação", simples: "Fita branca que você enrola na rosca para não vazar água." },
  { id: "P003", nome: "Torneira de parede para cozinha bica móvel", categoria: "Hidráulica", preco: 89.9, corredor: 4, prateleira: "C", nivel: 2, estoque: [15, 0], tags: "torneira cozinha pia bica parede", simples: "Torneira nova, caso a antiga esteja muito gasta." },
  { id: "P004", nome: "Kit reparo para caixa acoplada universal", categoria: "Banheiro", preco: 49.9, corredor: 3, prateleira: "B", nivel: 2, estoque: [22, 9], tags: "reparo caixa acoplada descarga vaso sanitario boia kit", simples: "Troca o mecanismo de dentro da caixa da descarga." },
  { id: "P005", nome: "Engate flexível 40 cm 1/2\"", categoria: "Hidráulica", preco: 18.9, corredor: 2, prateleira: "B", nivel: 1, estoque: [55, 30], tags: "engate flexivel mangueira ligacao agua", simples: "Mangueirinha que liga o cano da parede à torneira ou ao vaso." },
  { id: "P006", nome: "Desentupidor de borracha (ventosa)", categoria: "Limpeza", preco: 22.9, corredor: 3, prateleira: "D", nivel: 1, estoque: [31, 12], tags: "desentupidor ventosa borracha pia vaso ralo", simples: "A ventosa clássica: faz pressão e solta o entupimento." },
  { id: "P007", nome: "Sonda desentupidora com mola 5 m", categoria: "Hidráulica", preco: 39.9, corredor: 2, prateleira: "D", nivel: 2, estoque: [8, 14], tags: "sonda mola desentupidor cano ralo", simples: "Mola comprida que entra no cano e puxa a sujeira." },
  { id: "P008", nome: "Sifão sanfonado universal", categoria: "Hidráulica", preco: 14.9, corredor: 2, prateleira: "C", nivel: 2, estoque: [40, 25], tags: "sifao sanfonado pia tanque cano", simples: "Cano flexível embaixo da pia; costuma acumular sujeira." },
  { id: "P009", nome: "Gel desentupidor 1 L", categoria: "Limpeza", preco: 29.9, corredor: 4, prateleira: "D", nivel: 3, estoque: [26, 20], tags: "gel desentupidor quimico ralo pia", simples: "Produto que dissolve gordura e cabelo no ralo." },
  { id: "P010", nome: "Luva de correr PVC 25 mm", categoria: "Hidráulica", preco: 9.9, corredor: 2, prateleira: "A", nivel: 1, estoque: [70, 45], tags: "luva correr pvc emenda cano conserto", simples: "Emenda que conserta um pedaço de cano furado." },
  { id: "P011", nome: "Adesivo para PVC 75 g", categoria: "Hidráulica", preco: 13.9, corredor: 2, prateleira: "A", nivel: 2, estoque: [60, 38], tags: "cola adesivo pvc cano tubo", simples: "Cola específica para unir canos de PVC." },
  { id: "P012", nome: "Lixa d'água grão 150", categoria: "Pintura", preco: 2.9, corredor: 12, prateleira: "A", nivel: 2, estoque: [300, 210], tags: "lixa agua grao 150 lixar", simples: "Deixa a superfície áspera para a cola ou a tinta pegarem." },

  // Elétrica (5, 6, 7)
  { id: "P013", nome: "Resistência para chuveiro 220 V 6800 W", categoria: "Elétrica", preco: 34.9, corredor: 5, prateleira: "C", nivel: 2, estoque: [35, 16], tags: "resistencia chuveiro 220 esquentar agua quente", simples: "Peça que esquenta a água. Confira se seu chuveiro é 220 V ou 127 V." },
  { id: "P014", nome: "Resistência para chuveiro 127 V 5400 W", categoria: "Elétrica", preco: 32.9, corredor: 5, prateleira: "C", nivel: 3, estoque: [12, 21], tags: "resistencia chuveiro 127 110 esquentar", simples: "Versão para rede 127 V (110 V)." },
  { id: "P015", nome: "Alicate universal isolado 8\"", categoria: "Ferramentas", preco: 39.9, corredor: 8, prateleira: "B", nivel: 2, estoque: [24, 19], tags: "alicate universal isolado ferramenta", simples: "Alicate com cabo isolado, seguro para mexer em fios." },
  { id: "P016", nome: "Fita isolante 19 mm x 10 m", categoria: "Elétrica", preco: 7.9, corredor: 6, prateleira: "A", nivel: 2, estoque: [150, 90], tags: "fita isolante fio emenda eletrica", simples: "Cobre emendas de fio para não dar choque." },
  { id: "P017", nome: "Tomada 2P+T 10 A branca", categoria: "Elétrica", preco: 11.9, corredor: 5, prateleira: "A", nivel: 2, estoque: [80, 40], tags: "tomada 10a padrao novo tres pinos", simples: "Tomada comum para a maioria dos aparelhos." },
  { id: "P018", nome: "Tomada 2P+T 20 A branca", categoria: "Elétrica", preco: 14.9, corredor: 5, prateleira: "A", nivel: 3, estoque: [45, 0], tags: "tomada 20a microondas forno potente", simples: "Para aparelhos fortes (micro-ondas, forno, ar-condicionado)." },
  { id: "P019", nome: "Interruptor simples 1 tecla", categoria: "Elétrica", preco: 9.9, corredor: 5, prateleira: "A", nivel: 1, estoque: [70, 33], tags: "interruptor tecla luz liga desliga", simples: "Tecla de ligar e desligar a luz." },
  { id: "P020", nome: "Chave teste (testador de corrente)", categoria: "Ferramentas", preco: 12.9, corredor: 8, prateleira: "A", nivel: 3, estoque: [50, 22], tags: "chave teste testador corrente neon", simples: "Chave de fenda que acende quando tem energia no fio." },
  { id: "P021", nome: "Jogo de chaves de fenda e Phillips (6 peças)", categoria: "Ferramentas", preco: 44.9, corredor: 8, prateleira: "A", nivel: 2, estoque: [28, 17], tags: "chave fenda phillips jogo parafusar", simples: "Chaves para apertar e soltar parafusos." },
  { id: "P022", nome: "Lâmpada LED bulbo 9 W branca fria", categoria: "Iluminação", preco: 8.9, corredor: 7, prateleira: "B", nivel: 2, estoque: [400, 260], tags: "lampada led bulbo 9w luz branca queimada", simples: "Lâmpada econômica para o dia a dia." },
  { id: "P023", nome: "Plafon LED sobrepor 24 W", categoria: "Iluminação", preco: 59.9, corredor: 7, prateleira: "C", nivel: 2, estoque: [19, 11], tags: "plafon luminaria led teto sobrepor", simples: "Luminária de teto que já vem com a luz embutida." },
  { id: "P024", nome: "Disjuntor DIN 20 A", categoria: "Elétrica", preco: 19.9, corredor: 6, prateleira: "B", nivel: 2, estoque: [36, 20], tags: "disjuntor 20a quadro desarmando cai", simples: "Protege a fiação; fica no quadro de luz." },

  // Ferramentas e fixação (8, 9, 10)
  { id: "P025", nome: "Chave inglesa ajustável 10\"", categoria: "Ferramentas", preco: 46.9, corredor: 8, prateleira: "C", nivel: 2, estoque: [21, 13], tags: "chave inglesa ajustavel porca apertar", simples: "Chave que se ajusta para soltar porcas e torneiras." },
  { id: "P026", nome: "Furadeira de impacto 650 W", categoria: "Ferramentas", preco: 219.9, corredor: 9, prateleira: "B", nivel: 2, estoque: [9, 6], tags: "furadeira impacto furar parede concreto", simples: "Fura parede de tijolo e concreto." },
  { id: "P027", nome: "Kit buchas 6 e 8 mm com parafusos (50 un.)", categoria: "Fixação", preco: 16.9, corredor: 10, prateleira: "A", nivel: 2, estoque: [90, 70], tags: "bucha parafuso fixar parede 6 8 kit", simples: "Buchas e parafusos para prender coisas na parede." },
  { id: "P028", nome: "Nível de bolha 30 cm", categoria: "Ferramentas", preco: 24.9, corredor: 8, prateleira: "D", nivel: 2, estoque: [33, 18], tags: "nivel bolha reto alinhar", simples: "Mostra se o quadro ou a prateleira ficou reta." },
  { id: "P029", nome: "Broca para concreto 6 mm", categoria: "Ferramentas", preco: 9.9, corredor: 9, prateleira: "D", nivel: 1, estoque: [60, 41], tags: "broca concreto parede 6mm furar", simples: "Ponta da furadeira para furar parede." },
  { id: "P030", nome: "Trena 5 m", categoria: "Ferramentas", preco: 19.9, corredor: 8, prateleira: "D", nivel: 3, estoque: [45, 30], tags: "trena medir metro", simples: "Para medir paredes e espaços." },
  { id: "P031", nome: "Lubrificante spray multiuso 300 ml", categoria: "Ferramentas", preco: 27.9, corredor: 10, prateleira: "C", nivel: 2, estoque: [38, 29], tags: "lubrificante spray desengripante rangendo emperrada", simples: "Acaba com o rangido de portas e destrava fechaduras." },

  // Pintura (11, 12)
  { id: "P032", nome: "Tinta acrílica fosca branca 18 L", categoria: "Pintura", preco: 289.9, corredor: 11, prateleira: "A", nivel: 1, estoque: [30, 14], tags: "tinta acrilica fosca branca parede 18 litros lata", simples: "Rende cerca de 300 m² por demão. Ideal para casas inteiras." },
  { id: "P033", nome: "Tinta acrílica fosca branca 3,6 L", categoria: "Pintura", preco: 79.9, corredor: 11, prateleira: "A", nivel: 2, estoque: [64, 40], tags: "tinta acrilica galao 3,6 parede quarto", simples: "Rende cerca de 60 m² por demão. Dá para um quarto." },
  { id: "P034", nome: "Rolo de lã 23 cm com cabo", categoria: "Pintura", preco: 32.9, corredor: 12, prateleira: "B", nivel: 2, estoque: [48, 33], tags: "rolo la pintar parede", simples: "Rolo para pintar parede lisa." },
  { id: "P035", nome: "Bandeja para pintura", categoria: "Pintura", preco: 12.9, corredor: 12, prateleira: "B", nivel: 1, estoque: [70, 44], tags: "bandeja pintura rolo tinta", simples: "Onde você coloca a tinta para molhar o rolo." },
  { id: "P036", nome: "Fita crepe 48 mm x 50 m", categoria: "Pintura", preco: 15.9, corredor: 12, prateleira: "A", nivel: 3, estoque: [110, 75], tags: "fita crepe proteger rodape tomada", simples: "Protege rodapés e tomadas da tinta." },
  { id: "P037", nome: "Massa corrida PVA 5,8 kg", categoria: "Pintura", preco: 39.9, corredor: 11, prateleira: "C", nivel: 1, estoque: [27, 19], tags: "massa corrida buraco furo parede lisa", simples: "Tapa furinhos e deixa a parede lisa antes de pintar." },
  { id: "P038", nome: "Espátula de aço 8 cm", categoria: "Pintura", preco: 11.9, corredor: 12, prateleira: "C", nivel: 2, estoque: [55, 34], tags: "espatula aco massa raspar", simples: "Para passar massa e raspar tinta velha." },
  { id: "P039", nome: "Lona plástica 4 x 5 m", categoria: "Pintura", preco: 19.9, corredor: 12, prateleira: "D", nivel: 1, estoque: [40, 26], tags: "lona plastica proteger chao moveis", simples: "Cobre o chão e os móveis durante a pintura." },
  { id: "P040", nome: "Tinta acrílica antimofo branca 3,6 L", categoria: "Pintura", preco: 109.9, corredor: 11, prateleira: "B", nivel: 2, estoque: [18, 9], tags: "tinta antimofo mofo banheiro umidade", simples: "Tinta com proteção contra mofo para banheiros e áreas úmidas." },

  // Construção e revestimentos (13, 15)
  { id: "P041", nome: "Impermeabilizante acrílico para parede 3,6 L", categoria: "Construção", preco: 129.9, corredor: 13, prateleira: "A", nivel: 2, estoque: [14, 7], tags: "impermeabilizante infiltracao umidade parede", simples: "Cria uma camada que impede a umidade de passar." },
  { id: "P042", nome: "Removedor de mofo 500 ml", categoria: "Limpeza", preco: 24.9, corredor: 4, prateleira: "D", nivel: 2, estoque: [40, 23], tags: "removedor mofo bolor manchas pretas", simples: "Tira as manchas pretas de mofo antes de pintar." },
  { id: "P043", nome: "Rejunte flexível cinza 1 kg", categoria: "Revestimentos", preco: 18.9, corredor: 15, prateleira: "B", nivel: 2, estoque: [66, 41], tags: "rejunte flexivel azulejo piso junta", simples: "Preenche os espaços entre os azulejos." },
  { id: "P044", nome: "Argamassa AC-III 20 kg", categoria: "Construção", preco: 54.9, corredor: 13, prateleira: "C", nivel: 1, estoque: [25, 0], tags: "argamassa ac3 aciii colar azulejo piso", simples: "Cola de azulejo e piso, a mais resistente." },
  { id: "P045", nome: "Desempenadeira dentada", categoria: "Ferramentas", preco: 21.9, corredor: 15, prateleira: "D", nivel: 2, estoque: [20, 15], tags: "desempenadeira dentada argamassa espalhar", simples: "Espalha a argamassa por igual atrás do azulejo." },

  // Madeiras e organização (16, 17)
  { id: "P046", nome: "Prateleira MDF 60 x 20 cm com suporte invisível", categoria: "Madeiras", preco: 49.9, corredor: 16, prateleira: "B", nivel: 2, estoque: [22, 16], tags: "prateleira mdf suporte invisivel parede", simples: "Prateleira que parece flutuar na parede." },

  // Jardim (18)
  { id: "P047", nome: "Vaso plástico 30 cm", categoria: "Jardim", preco: 24.9, corredor: 18, prateleira: "A", nivel: 1, estoque: [50, 35], tags: "vaso plastico planta horta", simples: "Vaso médio para temperos e plantas." },
  { id: "P048", nome: "Terra adubada 10 kg", categoria: "Jardim", preco: 16.9, corredor: 18, prateleira: "C", nivel: 1, estoque: [80, 60], tags: "terra adubada substrato plantar", simples: "Terra pronta para plantar." },
  { id: "P049", nome: "Kit sementes de temperos (5 tipos)", categoria: "Jardim", preco: 19.9, corredor: 18, prateleira: "B", nivel: 3, estoque: [35, 28], tags: "sementes temperos horta manjericao salsinha", simples: "Manjericão, salsinha, cebolinha, coentro e alecrim." },
  { id: "P050", nome: "Regador 5 L", categoria: "Jardim", preco: 22.9, corredor: 18, prateleira: "D", nivel: 2, estoque: [26, 19], tags: "regador regar planta agua", simples: "Para regar sem encharcar." },

  // Portas (20)
  { id: "P051", nome: "Fechadura interna cromada", categoria: "Portas", preco: 69.9, corredor: 20, prateleira: "B", nivel: 2, estoque: [17, 10], tags: "fechadura porta interna macaneta trinco", simples: "Fechadura comum para portas de quarto e banheiro." },
  { id: "P052", nome: "Dobradiça 3\" (par)", categoria: "Portas", preco: 15.9, corredor: 20, prateleira: "C", nivel: 2, estoque: [44, 30], tags: "dobradica porta rangendo caida", simples: "Peça que segura a porta no batente." },
];

/*
 * Base de conhecimento do assistente: problemas comuns que o cliente descreve
 * com as próprias palavras. "fortes" pesam mais que "apoio" no reconhecimento.
 */
const PROBLEMAS = [
  {
    id: "torneira-pingando", titulo: "Torneira pingando",
    fortes: ["torneira", "pinga", "goteja", "gotejando", "pingando"],
    apoio: ["vaza", "vazamento", "agua", "pia", "cozinha", "fecha", "fechando", "gota", "desperdicio"],
    resumo: "Quase sempre o problema é o reparo vedante, uma borrachinha dentro da torneira que gasta com o tempo. Trocar é simples e barato.",
    dificuldade: "Fácil", tempo: "20 a 30 min", seguranca: "Feche o registro de água antes de começar.",
    passos: ["Feche o registro de água da casa ou da pia.", "Tire a cobertura da torneira e desenrosque o mecanismo com a chave inglesa.", "Troque o reparo vedante antigo pelo novo do mesmo tamanho (1/2\").", "Passe fita veda-rosca na rosca, monte de novo e abra o registro."],
    essenciais: ["P001", "P002", "P025"], opcionais: ["P003"],
    termos: { "reparo vedante": "a borrachinha que fecha a passagem de água dentro da torneira", "1/2\"": "meia polegada, a medida mais comum de rosca em casas", "registro": "a válvula que corta a água daquele cômodo ou da casa toda" },
    setor: 1,
  },
  {
    id: "descarga-vazando", titulo: "Descarga não para de correr",
    fortes: ["descarga", "caixa acoplada", "privada", "vaso sanitario", "boia"],
    apoio: ["corre", "correndo", "vaza", "agua", "banheiro", "barulho", "enche"],
    resumo: "Quando a água fica escorrendo para o vaso, o mecanismo da caixa acoplada (boia ou vedação) está gasto. O kit universal resolve a maioria dos modelos.",
    dificuldade: "Médio", tempo: "40 min", seguranca: "Feche o registro do vaso antes de abrir a caixa.",
    passos: ["Feche o registro atrás do vaso e dê descarga para esvaziar a caixa.", "Solte o engate flexível e retire o mecanismo antigo.", "Instale o kit novo seguindo a ordem do manual.", "Reconecte o engate (troque se estiver ressecado) e abra o registro."],
    essenciais: ["P004", "P005"], opcionais: ["P025"],
    termos: { "caixa acoplada": "a caixa de água que fica em cima do vaso", "engate flexível": "a mangueirinha que leva água da parede até a caixa" },
    setor: 3,
  },
  {
    id: "chuveiro-frio", titulo: "Chuveiro não esquenta",
    fortes: ["chuveiro", "esquenta", "frio", "gelada", "resistencia", "queimou"],
    apoio: ["agua", "quente", "banho", "morna", "fria"],
    resumo: "Na maioria das vezes a resistência do chuveiro queimou. Ela é barata, mas precisa ser da mesma voltagem (220 V ou 127 V) e do mesmo modelo do seu chuveiro.",
    dificuldade: "Fácil", tempo: "15 min", seguranca: "Desligue o disjuntor do chuveiro antes de abrir. Nunca troque com a energia ligada.",
    passos: ["Desligue o disjuntor do chuveiro no quadro de luz.", "Desenrosque a tampa do chuveiro e tire a resistência queimada.", "Encaixe a resistência nova (mesma voltagem) e feche a tampa.", "Abra a água primeiro e só depois religue o disjuntor."],
    essenciais: ["P013", "P015"], opcionais: ["P014", "P016"],
    termos: { "resistência": "a espiral de metal que esquenta a água", "disjuntor": "a chavinha no quadro de luz que corta a energia de um circuito", "voltagem": "a tensão da rede da sua casa: 220 V ou 127 V (também chamada de 110 V)" },
    setor: 5,
  },
  {
    id: "pia-entupida", titulo: "Pia ou ralo entupido",
    fortes: ["entupido", "entupida", "entupiu", "entope", "desentupir", "ralo"],
    apoio: ["pia", "agua", "desce", "parada", "cheiro", "tanque", "banheiro", "cozinha", "lento"],
    resumo: "Comece pelo mais simples: a ventosa resolve boa parte dos casos. Se não funcionar, a mola alcança o entupimento dentro do cano. O sifão também costuma acumular gordura.",
    dificuldade: "Fácil", tempo: "20 min", seguranca: "Use luvas. Não misture produtos químicos diferentes.",
    passos: ["Tente primeiro a ventosa: cubra o ralo e faça movimentos firmes.", "Se não resolver, solte o sifão embaixo da pia e limpe.", "Passe a sonda com mola pelo cano até sentir que liberou.", "Para manutenção, use o gel desentupidor uma vez por mês."],
    essenciais: ["P006", "P007"], opcionais: ["P008", "P009"],
    termos: { "sifão": "a curva de cano embaixo da pia que segura o mau cheiro", "sonda": "uma mola comprida que entra no cano" },
    setor: 2,
  },
  {
    id: "cano-vazando", titulo: "Cano furado ou vazando",
    fortes: ["cano", "furou", "furado", "tubo", "vazando cano", "estourou"],
    apoio: ["vaza", "vazamento", "agua", "pvc", "parede", "molhado", "rachou"],
    resumo: "Para cano de PVC aparente, a luva de correr substitui o trecho danificado sem precisar trocar o cano inteiro. Se o vazamento estiver dentro da parede, chame um especialista.",
    dificuldade: "Médio", tempo: "40 min", seguranca: "Feche o registro geral e espere o cano secar antes de colar.",
    passos: ["Feche o registro e corte o trecho furado do cano.", "Lixe as pontas do cano e por dentro da luva.", "Passe o adesivo para PVC nas duas partes.", "Encaixe a luva, espere a cola secar (veja a embalagem) e abra o registro."],
    essenciais: ["P010", "P011", "P012"], opcionais: [],
    termos: { "luva de correr": "uma emenda que desliza sobre o cano para cobrir o furo", "PVC": "o cano plástico branco, o mais comum nas casas" },
    setor: 2,
  },
  {
    id: "trocar-tomada", titulo: "Trocar tomada ou interruptor",
    fortes: ["tomada", "interruptor", "tecla", "plugue", "faisca"],
    apoio: ["solta", "queimada", "derreteu", "trocar", "luz", "nao funciona", "frouxa"],
    resumo: "Trocar tomada é rápido. Confira a amperagem: 10 A para a maioria dos aparelhos e 20 A para os fortes (micro-ondas, forno, ar-condicionado).",
    dificuldade: "Fácil", tempo: "15 min", seguranca: "Desligue o disjuntor e confirme com a chave teste que não há energia.",
    passos: ["Desligue o disjuntor do cômodo.", "Confirme com a chave teste que o fio está sem energia.", "Solte a tomada antiga e passe os fios para a nova na mesma posição (fase, neutro e terra).", "Parafuse na caixinha, coloque o espelho e religue o disjuntor."],
    essenciais: ["P017", "P020", "P021"], opcionais: ["P018", "P019", "P016"],
    termos: { "10 A / 20 A": "a corrente que a tomada aguenta; aparelho forte precisa de 20 A", "fase, neutro e terra": "os três fios da tomada; o terra é o verde ou verde e amarelo" },
    setor: 5,
  },
  {
    id: "lampada-iluminacao", titulo: "Lâmpada queimada ou luz fraca",
    fortes: ["lampada", "luminaria", "plafon", "iluminacao", "escuro"],
    apoio: ["queimou", "queimada", "fraca", "luz", "teto", "trocar", "pisca"],
    resumo: "Lâmpadas LED gastam menos e duram mais. Para um cômodo mais claro, um plafon LED substitui a lâmpada simples.",
    dificuldade: "Fácil", tempo: "10 min", seguranca: "Desligue o interruptor e espere a lâmpada esfriar.",
    passos: ["Desligue o interruptor.", "Troque a lâmpada pela LED (rosca comum E27).", "Para plafon: desligue o disjuntor, ligue os fios e parafuse no teto."],
    essenciais: ["P022"], opcionais: ["P023", "P020"],
    termos: { "E27": "a rosca comum das lâmpadas de casa", "branca fria": "luz mais clara, boa para cozinha e escritório" },
    setor: 7,
  },
  {
    id: "pintar-parede", titulo: "Pintar parede ou cômodo",
    fortes: ["pintar", "pintura", "tinta", "repintar"],
    apoio: ["parede", "quarto", "sala", "casa", "cor", "branca", "comodo", "renovar"],
    resumo: "Para um quarto, um galão de 3,6 L costuma bastar (duas demãos). Prepare a parede antes: tapar furos com massa corrida e proteger o chão faz toda a diferença no resultado.",
    dificuldade: "Fácil", tempo: "1 dia", seguranca: "Deixe o cômodo ventilado durante e depois da pintura.",
    passos: ["Cubra o chão e os móveis com a lona e proteja rodapés com fita crepe.", "Tape furos com massa corrida, espere secar e lixe.", "Passe a primeira demão com o rolo e espere 4 horas.", "Passe a segunda demão e retire a fita crepe com a tinta ainda fresca."],
    essenciais: ["P033", "P034", "P035", "P036", "P039"], opcionais: ["P037", "P038", "P012", "P032"],
    termos: { "demão": "cada camada de tinta", "massa corrida": "massa para tapar furinhos e alisar a parede (só para ambientes internos)" },
    setor: 11,
  },
  {
    id: "mofo-infiltracao", titulo: "Mofo, umidade ou infiltração",
    fortes: ["mofo", "bolor", "umidade", "infiltracao", "umida"],
    apoio: ["parede", "mancha", "preta", "banheiro", "descascando", "molhada", "cheiro"],
    resumo: "Primeiro remova o mofo e trate a umidade; só depois pinte, com tinta antimofo. Se a parede continua molhada mesmo seca por fora, pode haver vazamento interno: vale falar com um especialista.",
    dificuldade: "Médio", tempo: "2 dias", seguranca: "Use luvas e máscara ao aplicar o removedor de mofo.",
    passos: ["Aplique o removedor de mofo e deixe agir conforme a embalagem.", "Raspe a tinta solta com a espátula e espere a parede secar bem.", "Aplique o impermeabilizante em duas demãos.", "Finalize com tinta antimofo."],
    essenciais: ["P042", "P041", "P040", "P038"], opcionais: ["P034"],
    termos: { "infiltração": "água que entra pela parede vinda de fora ou de um cano", "impermeabilizante": "produto que cria uma barreira contra a água" },
    setor: 13,
  },
  {
    id: "pendurar-prateleira", titulo: "Pendurar prateleira, quadro ou TV",
    fortes: ["furar", "pendurar", "prateleira", "quadro", "fixar", "bucha"],
    apoio: ["parede", "furadeira", "parafuso", "suporte", "espelho", "nicho", "tv"],
    resumo: "Para parede de tijolo ou concreto, use furadeira com broca para concreto e bucha do mesmo tamanho da broca (6 mm com bucha 6). O nível garante que tudo fique reto.",
    dificuldade: "Fácil", tempo: "30 min", seguranca: "Evite furar perto de tomadas e interruptores: pode haver fios na parede.",
    passos: ["Marque a altura com a trena e confira com o nível.", "Fure com a broca 6 mm na função impacto.", "Coloque a bucha 6 e parafuse o suporte.", "Encaixe a prateleira e confira o nível de novo."],
    essenciais: ["P026", "P029", "P027", "P028"], opcionais: ["P046", "P030"],
    termos: { "bucha": "a pecinha de plástico que vai no furo para o parafuso firmar", "impacto": "função da furadeira para parede dura" },
    setor: 9,
  },
  {
    id: "azulejo-rejunte", titulo: "Azulejo solto ou rejunte encardido",
    fortes: ["azulejo", "rejunte", "piso solto", "ceramica", "pastilha"],
    apoio: ["solto", "caiu", "rachado", "encardido", "banheiro", "cozinha", "junta"],
    resumo: "Azulejo solto se recoloca com argamassa AC-III; depois é só refazer o rejunte. Para rejunte encardido, raspe o antigo e aplique o flexível, que não racha.",
    dificuldade: "Médio", tempo: "1 dia", seguranca: "Use luvas: argamassa resseca a pele.",
    passos: ["Retire o azulejo solto e raspe a argamassa velha.", "Espalhe argamassa AC-III com a desempenadeira dentada e assente o azulejo.", "Espere 24 h e aplique o rejunte flexível com a espátula.", "Limpe o excesso com pano úmido antes de secar."],
    essenciais: ["P044", "P045", "P043", "P038"], opcionais: [],
    termos: { "AC-III": "tipo de argamassa mais forte, para áreas molhadas e peças grandes", "rejunte": "a massa entre um azulejo e outro" },
    setor: 15,
  },
  {
    id: "horta-casa", titulo: "Montar uma horta em casa",
    fortes: ["horta", "temperos", "plantar", "jardim", "sementes"],
    apoio: ["vaso", "terra", "varanda", "apartamento", "manjericao", "plantas"],
    resumo: "Uma horta de temperos cabe em vasos na varanda. Precisa de pelo menos 4 horas de sol por dia e rega sem encharcar.",
    dificuldade: "Fácil", tempo: "30 min", seguranca: "Escolha um lugar com sol e com saída para a água da rega.",
    passos: ["Encha os vasos com terra adubada até 3 cm da borda.", "Plante as sementes na profundidade indicada no pacote.", "Regue de leve todos os dias até brotar.", "Depois, regue quando a terra estiver seca ao toque."],
    essenciais: ["P047", "P048", "P049", "P050"], opcionais: [],
    termos: { "terra adubada": "terra já misturada com nutrientes para as plantas" },
    setor: 18,
  },
  {
    id: "porta-rangendo", titulo: "Porta rangendo ou fechadura emperrada",
    fortes: ["porta", "rangendo", "range", "fechadura", "emperrada", "trinco", "macaneta"],
    apoio: ["barulho", "chave", "trava", "dobradica", "caida", "nao fecha"],
    resumo: "Rangido some com lubrificante nas dobradiças. Se a fechadura está emperrada, lubrifique primeiro; se continuar, troque a fechadura.",
    dificuldade: "Fácil", tempo: "15 min", seguranca: "Apoie a porta antes de soltar as dobradiças.",
    passos: ["Aplique lubrificante nas dobradiças e abra e feche algumas vezes.", "Lubrifique o miolo da fechadura pela entrada da chave.", "Se não resolver, troque a fechadura (meça a distância do furo até a borda da porta)."],
    essenciais: ["P031"], opcionais: ["P051", "P052", "P021"],
    termos: { "dobradiça": "a peça que segura a porta no batente e permite abrir", "miolo": "a parte da fechadura onde entra a chave" },
    setor: 20,
  },
];
