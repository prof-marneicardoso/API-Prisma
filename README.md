# 📘 Projeto: API-Prisma

Este é um guia passo a passo para construir uma API do zero usando:
- Node.js
- Express
- Prisma ORM
- Banco de Dados:
  - MySQL (local)
  - PostgreSQL (online: Supabase)



## 📢 O que é ORM?

ORM - **Object-Relational Mapping**: é uma forma de interagir com Bancos de Dados usando objetos no seu código, ao invés de comandos SQL manuais.

Com ORM:
- O código fica mais limpo, seguro e organizado
- Trabalhamos com objetos JavaScript
- Escrevemos menos SQL



## 🚀 Vamos começar!

### 📝 Pré-requisitos:
- Node.js (instalado)
- MySQL local (instalado)  
ou
- Conta no [Supabase](https://app.supabase.com)
- Editor de código (ex: VSCode)



---
## 📂 Crie a Estrutura de Pastas (básicas)

```
API-Prisma/
  ├── src/
        └── app.js
```



---
## 📂 Estrutura de Pastas (geradas no final)

```
API-Prisma/
├── node_modules/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   └── app.js
├── .env
├── .gitignore
├── package-lock.json
└── package.json
```



## 🎨 1. Criar o projeto

- Crie uma pasta: **API-Prisma**
- Abra a pasta no VSCode
- No Terminal, digite **npm init -y** para criar o **package.json**



## 📦 2. Instalar as dependências

```bash
npm i express dotenv @prisma/client
npm i prisma --save-dev
```



## 🔧 3. Iniciar o Prisma

```bash
npx prisma init
```

Esse comando cria:
- A pasta `prisma/`
- O arquivo `.env` (para configurar a URL do banco de dados)

---

(Sugestão: Instale a `extension: prisma` para melhor visualização)

---

## ⚙️ 4. Configurar o banco no .env

Abra o arquivo `.env` e cole **uma** das opções abaixo:

### 👉 Se estiver usando MySQL local:

```
DATABASE_URL="mysql://root:senha@localhost:3306/nome_do_banco"
```

> Altere `root` e `senha` conforme sua configuração.

### 👉 Se estiver usando Supabase (PostgreSQL):

```
DATABASE_URL="postgresql://usuario:senha@host:porta/nome_do_banco"
```

> Pegue a conexão no painel do Supabase (Database > Connection string)



## 🧩 5. Definir o modelo no Prisma

Abra `prisma/schema.prisma` e configure assim:

```
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma" // Apague esta linha gerada
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())

  @@map("users") // <-- define o nome da tabela no banco como "users"
}
```



## 📚 6. Criar a primeira migração

```bash
npx prisma migrate dev --name basic
```

Isso vai:
- Criar a tabela no banco
- Gerar o Prisma Client automaticamente
- Criar a pasta `migrations`
- Criar uma pasta com a data e nome
  - (ex: 20250610054818_basic)
- Criar um arquivo `migration.sql` com as intruções em SQL para a criação da tabela `user`

---

Se quiser visualizar as tabelas reais no banco, use:

```
npx prisma studio
```



## 📝 7. Criar a API com Express + Prisma

Abra `src/app.js` e digite as linhas:

```js
import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
```



### ✍️ Agora, adicione as rotas:

```js
const host = "localhost";
const port = 3300;

// Rota para criar um novo usuário
app.post("/users", async (request, response) => {
  const user = await prisma.user.create({
    data: request.body,
  });
  response.json(user);
});

/// Rota para listar todos os usuários
app.get("/users", async (request, response) => {
  const users = await prisma.user.findMany();
  response.json(users);
});

// Rota para listar um usuário
app.get("/users/:id", async (request, response) => {
  const id = parseInt(request.params.id);
  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    return response.status(404).json({ error: "Usuário não encontrado" });
  }
  response.json(user);
});

// Rota para atualizar um usuário
app.put("/users/:id", async (request, response) => {
  const { id } = request.params;
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: request.body,
  });
  response.json(user);
});

// Rota para deletar um usuário
app.delete("/users/:id", async (request, response) => {
  const { id } = request.params;
  await prisma.user.delete({
    where: { id: Number(id) },
  });
  response.sendStatus(204);
});
```



### Por fim, adicione a linha que inicia o servidor:

```js
app.listen(port, () => {
  console.log(`Servidor rodando em http://${host}$:${port}`);
});
```



---

O arquivo `package.json` deve ficar assim:

```json
{
  "name": "api-prisma",
  "version": "1.0.0",
  "main": "app.js",
  "type": "module",
  "scripts": {
    "dev": "node ./src/app.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@prisma/client": "^6.9.0",
    "dotenv": "^16.5.0",
    "express": "^5.1.0"
  },
  "devDependencies": {
    "prisma": "^6.9.0"
  }
}
```

---



## 🚀 8. Rodar a API

### No terminal:

```bash
npm run dev
```

A mensagem deverá ser:

```
Servidor rodando em http://localhost:3300
```



## 🧪 9. Testar no Postman ou Thunder Client

- `POST /users` → criar usuário
- `GET /users` → listar usuários
- `PUT /users/:id` → editar usuário
- `DELETE /users/:id` → remover usuário

---

## 🏁 Conclusão

Agora temos uma **API funcional com CRUD** completo usando:
- Express
- Prisma
- MySQL ou Supabase
