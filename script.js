// script.js
// Conversor de moedas entre países: usa a REST Countries para nomes,
// bandeiras e códigos de moeda, e a ExchangeRate-API para as taxas de câmbio.

const URL_PAISES = 'https://restcountries.com/v3.1/all?fields=name,flags,currencies,cca2';
const URL_TAXA = (codigo) => `https://open.er-api.com/v6/latest/${codigo}`;

// País padrão sugerido em cada lado, se existir na lista.
const PAIS_ORIGEM_PADRAO = 'BR';
const PAIS_DESTINO_PADRAO = 'US';

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

// Guarda os dados dos países já tratados, indexados pelo código (cca2).
let paisesPorCodigo = {};

/**
 * Busca a lista de países e monta os dois <select>.
 * Alguns países não têm moeda cadastrada (ex.: territórios) e são ignorados.
 */
async function carregarPaises() {
  try {
    const resposta = await fetch(URL_PAISES);
    if (!resposta.ok) throw new Error('Falha ao carregar países');
    const dados = await resposta.json();

    const paisesValidos = dados
      .filter((p) => p.currencies && Object.keys(p.currencies).length > 0)
      .map((p) => {
        const codigoMoeda = Object.keys(p.currencies)[0];
        const infoMoeda = p.currencies[codigoMoeda];
        return {
          codigo: p.cca2,
          nome: p.name.common,
          bandeira: p.flags?.png || p.flags?.svg || '',
          codigoMoeda,
          nomeMoeda: infoMoeda.name,
          simboloMoeda: infoMoeda.symbol || codigoMoeda,
        };
      })
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

    paisesValidos.forEach((pais) => {
      paisesPorCodigo[pais.codigo] = pais;
    });

    preencherSelect(selectOrigem, paisesValidos);
    preencherSelect(selectDestino, paisesValidos);

    // Sugere Brasil -> Estados Unidos se ambos existirem na lista.
    if (paisesPorCodigo[PAIS_ORIGEM_PADRAO]) selectOrigem.value = PAIS_ORIGEM_PADRAO;
    if (paisesPorCodigo[PAIS_DESTINO_PADRAO]) selectDestino.value = PAIS_DESTINO_PADRAO;

    atualizarSelo('origem');
    atualizarSelo('destino');
    statusCarregamento.hidden = true;
  } catch (erro) {
    statusCarregamento.hidden = true;
    exibirErro('Não foi possível carregar a lista de países agora. Verifique sua conexão e recarregue a página.');
  }
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

  imgBandeira.src = pais.bandeira;
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
    mostrarResultado({ paisOrigem, paisDestino, valor, taxa, valorConvertido });
  } catch (erro) {
    exibirErro('A API de câmbio não respondeu. Tente novamente em instantes.');
  } finally {
    botaoConverter.disabled = false;
    botaoConverter.textContent = 'Converter';
  }
}

function mostrarResultado({ paisOrigem, paisDestino, valor, taxa, valorConvertido }) {
  const linhaConta = resultado.querySelector('.resultado-conta');
  const linhaValor = resultado.querySelector('.resultado-valor');
  const linhaTaxa = resultado.querySelector('.resultado-taxa');

  linhaConta.textContent = `${paisOrigem.nome} → ${paisDestino.nome}`;
  linhaValor.textContent = `${formatarMoeda(valor, paisOrigem.codigoMoeda)} = ${formatarMoeda(valorConvertido, paisDestino.codigoMoeda)}`;
  linhaTaxa.textContent = `1 ${paisOrigem.codigoMoeda} = ${taxa.toFixed(4)} ${paisDestino.codigoMoeda}`;

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
