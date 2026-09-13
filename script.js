// script.js
// Conversor de moedas entre países: os dados de país/bandeira/moeda ficam
// numa lista local (a REST Countries bloqueia CORS para GitHub Pages), as
// bandeiras vêm do FlagCDN (imagem simples, sem CORS) e a cotação em tempo
// real vem da ExchangeRate-API via fetch.

const URL_TAXA = (codigo) => `https://open.er-api.com/v6/latest/${codigo}`;
const URL_BANDEIRA = (cca2) => `https://flagcdn.com/w80/${cca2.toLowerCase()}.png`;

// País padrão sugerido em cada lado, se existir na lista.
const PAIS_ORIGEM_PADRAO = 'BR';
const PAIS_DESTINO_PADRAO = 'US';

// Lista local de países e suas moedas (evita depender de uma API externa
// só para esses dados, que quase nunca mudam).
const PAISES = [
  { codigo: 'AR', nome: 'Argentina', codigoMoeda: 'ARS', nomeMoeda: 'Peso Argentino' },
  { codigo: 'AU', nome: 'Austrália', codigoMoeda: 'AUD', nomeMoeda: 'Dólar Australiano' },
  { codigo: 'AT', nome: 'Áustria', codigoMoeda: 'EUR', nomeMoeda: 'Euro' },
  { codigo: 'BE', nome: 'Bélgica', codigoMoeda: 'EUR', nomeMoeda: 'Euro' },
  { codigo: 'BO', nome: 'Bolívia', codigoMoeda: 'BOB', nomeMoeda: 'Boliviano' },
  { codigo: 'BR', nome: 'Brasil', codigoMoeda: 'BRL', nomeMoeda: 'Real' },
  { codigo: 'CA', nome: 'Canadá', codigoMoeda: 'CAD', nomeMoeda: 'Dólar Canadense' },
  { codigo: 'CL', nome: 'Chile', codigoMoeda: 'CLP', nomeMoeda: 'Peso Chileno' },
  { codigo: 'CN', nome: 'China', codigoMoeda: 'CNY', nomeMoeda: 'Yuan' },
  { codigo: 'CO', nome: 'Colômbia', codigoMoeda: 'COP', nomeMoeda: 'Peso Colombiano' },
  { codigo: 'CR', nome: 'Costa Rica', codigoMoeda: 'CRC', nomeMoeda: 'Colón' },
  { codigo: 'CZ', nome: 'República Tcheca', codigoMoeda: 'CZK', nomeMoeda: 'Coroa Tcheca' },
  { codigo: 'DK', nome: 'Dinamarca', codigoMoeda: 'DKK', nomeMoeda: 'Coroa Dinamarquesa' },
  { codigo: 'EG', nome: 'Egito', codigoMoeda: 'EGP', nomeMoeda: 'Libra Egípcia' },
  { codigo: 'EE', nome: 'Estônia', codigoMoeda: 'EUR', nomeMoeda: 'Euro' },
  { codigo: 'FI', nome: 'Finlândia', codigoMoeda: 'EUR', nomeMoeda: 'Euro' },
  { codigo: 'FR', nome: 'França', codigoMoeda: 'EUR', nomeMoeda: 'Euro' },
  { codigo: 'DE', nome: 'Alemanha', codigoMoeda: 'EUR', nomeMoeda: 'Euro' },
  { codigo: 'GR', nome: 'Grécia', codigoMoeda: 'EUR', nomeMoeda: 'Euro' },
  { codigo: 'HK', nome: 'Hong Kong', codigoMoeda: 'HKD', nomeMoeda: 'Dólar de Hong Kong' },
  { codigo: 'HU', nome: 'Hungria', codigoMoeda: 'HUF', nomeMoeda: 'Florim' },
  { codigo: 'IS', nome: 'Islândia', codigoMoeda: 'ISK', nomeMoeda: 'Coroa Islandesa' },
  { codigo: 'IN', nome: 'Índia', codigoMoeda: 'INR', nomeMoeda: 'Rupia Indiana' },
  { codigo: 'ID', nome: 'Indonésia', codigoMoeda: 'IDR', nomeMoeda: 'Rupia Indonésia' },
  { codigo: 'IE', nome: 'Irlanda', codigoMoeda: 'EUR', nomeMoeda: 'Euro' },
  { codigo: 'IL', nome: 'Israel', codigoMoeda: 'ILS', nomeMoeda: 'Novo Shekel' },
  { codigo: 'IT', nome: 'Itália', codigoMoeda: 'EUR', nomeMoeda: 'Euro' },
  { codigo: 'JP', nome: 'Japão', codigoMoeda: 'JPY', nomeMoeda: 'Iene' },
  { codigo: 'KE', nome: 'Quênia', codigoMoeda: 'KES', nomeMoeda: 'Xelim Queniano' },
  { codigo: 'KR', nome: 'Coreia do Sul', codigoMoeda: 'KRW', nomeMoeda: 'Won' },
  { codigo: 'MY', nome: 'Malásia', codigoMoeda: 'MYR', nomeMoeda: 'Ringgit' },
  { codigo: 'MX', nome: 'México', codigoMoeda: 'MXN', nomeMoeda: 'Peso Mexicano' },
  { codigo: 'MA', nome: 'Marrocos', codigoMoeda: 'MAD', nomeMoeda: 'Dirham' },
  { codigo: 'NL', nome: 'Países Baixos', codigoMoeda: 'EUR', nomeMoeda: 'Euro' },
  { codigo: 'NZ', nome: 'Nova Zelândia', codigoMoeda: 'NZD', nomeMoeda: 'Dólar Neozelandês' },
  { codigo: 'NG', nome: 'Nigéria', codigoMoeda: 'NGN', nomeMoeda: 'Naira' },
  { codigo: 'NO', nome: 'Noruega', codigoMoeda: 'NOK', nomeMoeda: 'Coroa Norueguesa' },
  { codigo: 'PA', nome: 'Panamá', codigoMoeda: 'PAB', nomeMoeda: 'Balboa' },
  { codigo: 'PY', nome: 'Paraguai', codigoMoeda: 'PYG', nomeMoeda: 'Guarani' },
  { codigo: 'PE', nome: 'Peru', codigoMoeda: 'PEN', nomeMoeda: 'Sol' },
  { codigo: 'PH', nome: 'Filipinas', codigoMoeda: 'PHP', nomeMoeda: 'Peso Filipino' },
  { codigo: 'PL', nome: 'Polônia', codigoMoeda: 'PLN', nomeMoeda: 'Zloty' },
  { codigo: 'PT', nome: 'Portugal', codigoMoeda: 'EUR', nomeMoeda: 'Euro' },
  { codigo: 'RO', nome: 'Romênia', codigoMoeda: 'RON', nomeMoeda: 'Leu Romeno' },
  { codigo: 'SA', nome: 'Arábia Saudita', codigoMoeda: 'SAR', nomeMoeda: 'Rial Saudita' },
  { codigo: 'SG', nome: 'Singapura', codigoMoeda: 'SGD', nomeMoeda: 'Dólar de Singapura' },
  { codigo: 'ZA', nome: 'África do Sul', codigoMoeda: 'ZAR', nomeMoeda: 'Rand' },
  { codigo: 'ES', nome: 'Espanha', codigoMoeda: 'EUR', nomeMoeda: 'Euro' },
  { codigo: 'SE', nome: 'Suécia', codigoMoeda: 'SEK', nomeMoeda: 'Coroa Sueca' },
  { codigo: 'CH', nome: 'Suíça', codigoMoeda: 'CHF', nomeMoeda: 'Franco Suíço' },
  { codigo: 'TH', nome: 'Tailândia', codigoMoeda: 'THB', nomeMoeda: 'Baht' },
  { codigo: 'TR', nome: 'Turquia', codigoMoeda: 'TRY', nomeMoeda: 'Lira Turca' },
  { codigo: 'UA', nome: 'Ucrânia', codigoMoeda: 'UAH', nomeMoeda: 'Hryvnia' },
  { codigo: 'GB', nome: 'Reino Unido', codigoMoeda: 'GBP', nomeMoeda: 'Libra Esterlina' },
  { codigo: 'US', nome: 'Estados Unidos', codigoMoeda: 'USD', nomeMoeda: 'Dólar Americano' },
  { codigo: 'UY', nome: 'Uruguai', codigoMoeda: 'UYU', nomeMoeda: 'Peso Uruguaio' },
  { codigo: 'VN', nome: 'Vietnã', codigoMoeda: 'VND', nomeMoeda: 'Dong' },
  { codigo: 'VE', nome: 'Venezuela', codigoMoeda: 'VES', nomeMoeda: 'Bolívar' },
  { codigo: 'CU', nome: 'Cuba', codigoMoeda: 'CUP', nomeMoeda: 'Peso Cubano' },
  { codigo: 'DO', nome: 'República Dominicana', codigoMoeda: 'DOP', nomeMoeda: 'Peso Dominicano' },
];

const selectOrigem = document.getElementById('select-origem');
const selectDestino = document.getElementById('select-destino');
const bandeiraOrigem = document.getElementById('bandeira-origem');
const bandeiraDestino = document.getElementById('bandeira-destino');
const moedaOrigemTag = document.getElementById('moeda-origem');
const moedaDestinoTag = document.getElementById('moeda-destino');
const campoValor = document.getElementById('campo-valor');
const form = document.getElementById('form-conversao');
const botaoConverter = document.getElementById('botao-converter');
const botaoInverter = document.getElementById('botao-inverter');
const resultado = document.getElementById('resultado');
const mensagemErro = document.getElementById('mensagem-erro');
const statusCarregamento = document.getElementById('carregando-paises');

// Guarda os dados dos países, indexados pelo código (cca2), para consulta rápida.
const paisesPorCodigo = {};
PAISES.forEach((pais) => {
  paisesPorCodigo[pais.codigo] = pais;
});

/** Monta os dois <select> com a lista local de países, ordenada por nome. */
function carregarPaises() {
  const paisesOrdenados = [...PAISES].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  preencherSelect(selectOrigem, paisesOrdenados);
  preencherSelect(selectDestino, paisesOrdenados);

  // Sugere Brasil -> Estados Unidos como ponto de partida.
  if (paisesPorCodigo[PAIS_ORIGEM_PADRAO]) selectOrigem.value = PAIS_ORIGEM_PADRAO;
  if (paisesPorCodigo[PAIS_DESTINO_PADRAO]) selectDestino.value = PAIS_DESTINO_PADRAO;

  atualizarSelo('origem');
  atualizarSelo('destino');
  statusCarregamento.hidden = true;
}

function preencherSelect(select, paises) {
  select.innerHTML = '';
  paises.forEach((pais) => {
    const opcao = document.createElement('option');
    opcao.value = pais.codigo;
    opcao.textContent = pais.nome;
    select.appendChild(opcao);
  });
}

/**
 * Atualiza a bandeira e a etiqueta de moeda de um dos dois lados
 * ('origem' ou 'destino') com base no país selecionado.
 */
function atualizarSelo(lado) {
  const select = lado === 'origem' ? selectOrigem : selectDestino;
  const imgBandeira = lado === 'origem' ? bandeiraOrigem : bandeiraDestino;
  const tagMoeda = lado === 'origem' ? moedaOrigemTag : moedaDestinoTag;

  const pais = paisesPorCodigo[select.value];
  if (!pais) return;

  imgBandeira.src = URL_BANDEIRA(pais.codigo);
  imgBandeira.alt = `Bandeira de ${pais.nome}`;
  imgBandeira.hidden = false;
  tagMoeda.textContent = `${pais.codigoMoeda} · ${pais.nomeMoeda}`;
}

/** Troca os países selecionados nos dois lados. */
function inverterPaises() {
  const valorOrigem = selectOrigem.value;
  const valorDestino = selectDestino.value;
  selectOrigem.value = valorDestino;
  selectDestino.value = valorOrigem;
  atualizarSelo('origem');
  atualizarSelo('destino');
}

/** Busca a taxa de câmbio e mostra o resultado na tela. */
async function converter(evento) {
  evento.preventDefault();
  esconderErro();

  const paisOrigem = paisesPorCodigo[selectOrigem.value];
  const paisDestino = paisesPorCodigo[selectDestino.value];
  const valor = Number(campoValor.value);

  if (!paisOrigem || !paisDestino) {
    exibirErro('Escolha um país de origem e um país de destino.');
    return;
  }
  if (!Number.isFinite(valor) || valor <= 0) {
    exibirErro('Digite um valor maior que zero para converter.');
    return;
  }

  botaoConverter.disabled = true;
  botaoConverter.textContent = 'Consultando…';
  resultado.hidden = true;

  try {
    const resposta = await fetch(URL_TAXA(paisOrigem.codigoMoeda));
    if (!resposta.ok) throw new Error('API de câmbio fora do ar');

    const dados = await resposta.json();
    const taxa = dados.rates?.[paisDestino.codigoMoeda];

    if (!taxa) {
      exibirErro(
        `Não encontramos uma cotação de ${paisOrigem.codigoMoeda} para ${paisDestino.codigoMoeda}. Tente outro par de países.`
      );
      return;
    }

    const valorConvertido = valor * taxa;
    const atualizadoEm = dados.time_last_update_utc;
    mostrarResultado({ paisOrigem, paisDestino, valor, taxa, valorConvertido, atualizadoEm });
  } catch (erro) {
    exibirErro('A API de câmbio não respondeu. Tente novamente em instantes.');
  } finally {
    botaoConverter.disabled = false;
    botaoConverter.textContent = 'Converter';
  }
}

function mostrarResultado({ paisOrigem, paisDestino, valor, taxa, valorConvertido, atualizadoEm }) {
  const linhaConta = resultado.querySelector('.resultado-conta');
  const linhaValor = resultado.querySelector('.resultado-valor');
  const linhaTaxa = resultado.querySelector('.resultado-taxa');

  linhaConta.textContent = `${paisOrigem.nome} → ${paisDestino.nome}`;
  linhaValor.textContent = `${formatarMoeda(valor, paisOrigem.codigoMoeda)} = ${formatarMoeda(valorConvertido, paisDestino.codigoMoeda)}`;
  linhaTaxa.textContent = `1 ${paisOrigem.codigoMoeda} = ${taxa.toFixed(4)} ${paisDestino.codigoMoeda} · cotação atualizada em ${atualizadoEm}`;

  resultado.hidden = false;
}

function formatarMoeda(valor, codigo) {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: codigo }).format(valor);
  } catch {
    // Alguns códigos raros não são reconhecidos pelo Intl; cai para um formato simples.
    return `${codigo} ${valor.toFixed(2)}`;
  }
}

function exibirErro(texto) {
  mensagemErro.textContent = texto;
  mensagemErro.hidden = false;
}

function esconderErro() {
  mensagemErro.hidden = true;
  mensagemErro.textContent = '';
}

selectOrigem.addEventListener('change', () => atualizarSelo('origem'));
selectDestino.addEventListener('change', () => atualizarSelo('destino'));
botaoInverter.addEventListener('click', inverterPaises);
form.addEventListener('submit', converter);

carregarPaises();
