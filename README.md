<img width="1213" height="142" alt="evidenciassq2-tags-dockerhub png" src="https://github.com/user-attachments/assets/ac303dc2-57ca-466c-aa7f-a78ed80a6826" />
# Câmbio Direto

## Autor
Caio Henrique Stecanella — Matrícula 22552755

## Descrição
Aplicação web que converte valores entre as moedas de dois países, mostrando as bandeiras, e permite salvar as conversões favoritas num banco de dados real.

## Links
- **Repositório GitHub:** https://github.com/caiohs454/Cambio-direto
- **Aplicação no ar (GitHub Pages):** https://caiohs454.github.io/Cambio-direto/
- **Docker Hub:** https://hub.docker.com/r/caiohs454/cambio-direto

## Como executar (Docker)
```
docker run -d -p 8080:80 caiohs454/cambio-direto:1.1
```
Depois abra http://localhost:8080 no navegador.

## API utilizada
- [ExchangeRate-API](https://www.exchangerate-api.com/docs/free) via `fetch`: `GET https://open.er-api.com/v6/latest/{codigo_da_moeda}`
- Lista de países e moedas local no `script.js`; bandeiras via [FlagCDN](https://flagcdn.com/).

## Persistência de dados
- **Banco escolhido:** Supabase (PostgreSQL), acessado direto do frontend com `supabase-js`.
- **Tabela `favoritos`:** `id` (identidade), `criado_em` (timestamp), `pais_origem` (código do país), `pais_destino` (código do país), `valor` (valor digitado), `taxa` (cotação usada) e `resultado` (valor convertido).
- **O que é salvo:** cada conversão que o usuário clica em "Salvar conversão". A seção "Minhas conversões salvas" lista os registros ao abrir a página e permite excluir cada um (criar, listar e excluir).
- **Limitação conhecida:** as políticas de acesso (RLS) estão abertas para o papel `anon` (leitura, inserção e exclusão), como permitido nesta etapa. Por isso a lista é compartilhada entre todos os visitantes e não há autenticação.

## Sidequests
### SQ1 · .dockerignore
O arquivo `.dockerignore` exclui `.git`, `README.md`, evidências e outros arquivos que a aplicação não precisa para rodar. Com isso o contexto enviado ao Docker é menor, o build é mais rápido e a imagem final fica menor e sem arquivos desnecessários.

### SQ2 · Versionamento de imagem
Publicadas no Docker Hub as tags `1.0`, `1.1` e `latest`:
```
docker push caiohs454/cambio-direto:1.0
docker push caiohs454/cambio-direto:1.1
docker push caiohs454/cambio-direto:latest
```

### SQ3 · Descrição no Docker Hub
O overview do repositório no Docker Hub traz o que é a aplicação, o comando `docker run` pronto e o link do repositório GitHub.

### SQ4 · Explorando a orquestração
Dois containers da mesma aplicação rodando ao mesmo tempo, nas portas 8080 e 8081:
```
docker run -d -p 8080:80 --name app1 caiohs454/cambio-direto:1.1
docker run -d -p 8081:80 --name app2 caiohs454/cambio-direto:1.1
```
Evidência: !<img width="1213" height="142" alt="evidenciassq2-tags-dockerhub png" src="https://github.com/user-attachments/assets/6ec0814f-4e83-4006-8c59-37ed6fe99322" /><img width="1178" height="64" alt="evidenciassq4-docker-ps png" src="https://github.com/user-attachments/assets/8095d1c8-359e-43e8-aeab-79a2d8f7b0d6" />



**Se eu tivesse 100 containers, como gerenciaria?** Subir e vigiar 100 containers na mão é inviável. O Kubernetes é um orquestrador: o conjunto de máquinas forma um *cluster*, e a menor unidade que ele executa é o *pod* (um ou mais containers juntos). Eu declaro quantas *réplicas* do pod quero e o Kubernetes distribui os pods entre as máquinas, reinicia os que falham, balanceia o tráfego entre as réplicas e aumenta ou diminui a quantidade conforme a demanda.
