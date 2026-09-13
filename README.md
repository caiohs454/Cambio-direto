# Câmbio Direto

## Autor
Caio Henrique Stecanella — RA:22552755

## Descrição
Aplicação web que converte valores entre as moedas de dois países escolhidos pelo usuário, mostrando a bandeira e o código da moeda de cada um.

## API Utilizada
- [REST Countries](https://restcountries.com/) — nomes, bandeiras e moedas dos países. Endpoint: `GET https://restcountries.com/v3.1/all?fields=name,flags,currencies,cca2`
- [ExchangeRate-API (open.er-api.com)](https://www.exchangerate-api.com/docs/free) — taxas de câmbio atualizadas. Endpoint: `GET https://open.er-api.com/v6/latest/{codigo_da_moeda}`

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
- **Aplicação no ar (GitHub Pages):** https://seu-usuario.github.io/cambio-direto/
- **Repositório:** https://github.com/seu-usuario/cambio-direto
