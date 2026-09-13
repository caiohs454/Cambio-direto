# Câmbio Direto

## Autor
[Seu nome completo] — Matrícula [seu número de matrícula]

## Descrição
Aplicação web que converte valores entre as moedas de dois países escolhidos pelo usuário, mostrando a bandeira e o código da moeda de cada um.

## API Utilizada
- [ExchangeRate-API (open.er-api.com)](https://www.exchangerate-api.com/docs/free) — taxas de câmbio atualizadas, consumida via `fetch`. Endpoint: `GET https://open.er-api.com/v6/latest/{codigo_da_moeda}`
- Nomes e códigos de moeda dos países ficam numa lista local no `script.js` (a REST Countries bloqueia CORS ao ser chamada de um GitHub Pages, então essa parte não depende de uma API externa). As bandeiras vêm do [FlagCDN](https://flagcdn.com/), carregadas como imagem.

## Funcionalidades
- Selecionar um país de origem e um país de destino, com bandeira e código da moeda exibidos automaticamente
- Inverter os dois países com um clique
- Converter um valor digitado usando a cotação em tempo real
- Ver a taxa de câmbio usada (1 moeda de origem = X moeda de destino)
- Mensagens claras quando a API não responde, quando não há cotação para o par escolhido ou quando o valor digitado é inválido

## Como executar localmente
1. Clone: `git clone URL_DO_REPOSITORIO`
2. Abra o arquivo `index.html` no navegador (ou use a extensão Live Server do VS Code)

## Links
- **Aplicação no ar (GitHub Pages):** https://caiohs454.github.io/Cambio-direto/
- **Repositório:** https://github.com/caiohs454/Cambio-direto
