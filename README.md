# CineMais — Clube MaisPipoca

Projeto Integrador de Desenvolvimento Web, Etapa 2. O CineMais é um site de cinema com cinco páginas; a parte dinâmica é o cadastro de membros do **Clube MaisPipoca** (um CRUD completo).

- **Frontend:** HTML, CSS e JavaScript puro (`fetch` + JSON, sem recarregar a página).
- **Backend:** Node.js com Express.
- **Banco:** SQLite, via `better-sqlite3`. Só o servidor acessa o banco.

> README temporário: o JavaScript das páginas do clube (`club.js` e `members.js`) ainda está em construção.

## Como rodar

Requisito: Node.js 22 ou mais recente (exigência do `better-sqlite3`).

```bash
npm install
npm start
```

Depois abra http://localhost:3000. O arquivo do banco (`cinemais.db`) é criado sozinho na primeira execução, junto com a tabela `members`.

## Rotas da API

Todas as respostas são JSON. Em caso de erro, o corpo é `{ "error": "mensagem" }`.

| Método | Rota | O que faz | Respostas |
|---|---|---|---|
| GET | `/members` | Lista todos os membros (mais recentes primeiro) | 200 |
| GET | `/members/:id` | Busca um membro pelo id | 200, 404 |
| POST | `/members` | Cadastra um membro | 201 (membro criado), 400 |
| PUT | `/members/:id` | Atualiza um membro inteiro | 200 (membro atualizado), 400, 404 |
| DELETE | `/members/:id` | Exclui um membro | 204 (sem corpo), 404 |

Qualquer rota responde 500 se o banco falhar.

### Corpo do POST e do PUT

O cabeçalho `Content-Type: application/json` é obrigatório.

```json
{
  "name": "Ana Souza",
  "email": "ana@email.com",
  "birth_date": "2000-05-20",
  "plan": "Média",
  "student": true,
  "zip_code": "57300-000",
  "street": "Rua Super Nintendo",
  "house_number": 42,
  "city": "Arapiraca",
  "state": "AL",
  "address_details": null
}
```

### Regras de validação (no servidor)

| Campo | Regra |
|---|---|
| `name` | texto de 2 a 100 caracteres |
| `email` | formato de e-mail, até 100 caracteres |
| `birth_date` | data no formato `AAAA-MM-DD` |
| `plan` | `Pequena`, `Média` ou `Grande` |
| `student` | `true` ou `false` (gravado como 1 ou 0) |
| `zip_code` | CEP no formato `00000-000` ou `00000000` |
| `street` | texto de 2 a 100 caracteres |
| `house_number` | opcional; inteiro de 1 a 99999 |
| `city` | texto de 2 a 100 caracteres |
| `state` | sigla de uma das 27 UFs |
| `address_details` | opcional; texto de até 200 caracteres |

O servidor responde 400 com a mensagem do primeiro campo inválido. O `id` e a `registration_date` são gerados pelo banco.

### Teste rápido com curl

```bash
curl -i http://localhost:3000/members
```

```bash
curl -i -X POST http://localhost:3000/members -H "Content-Type: application/json" -d '{"name":"Ana Souza","email":"ana@email.com","birth_date":"2000-05-20","plan":"Média","student":true,"zip_code":"57300-000","street":"Rua Super Nintendo","house_number":42,"city":"Arapiraca","state":"AL","address_details":null}'
```

## Estrutura

```
server.js          rotas da API, validação e servidor dos arquivos estáticos
db.js              abre o SQLite e cria a tabela members
package.json       dependências (express, better-sqlite3) e o script start
public/
  index.html       início: banner e destaques da semana
  movies.html      filmes em cartaz
  details.html     detalhes de um filme
  club.html        formulário de inscrição e edição de membro
  members.html     área da equipe: lista, busca, filtro e exclusão
  css/style.css    estilos de todas as páginas
  js/              scripts do clube (em construção)
```

## Equipe

(a preencher)
