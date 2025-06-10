import "dotenv/config";
import express, { request, response } from "express";
import { PrismaClient } from "@prisma/client";
import { use } from "react";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

const host = "localhost";
const port = 3300;

// Rota para criar um novo Usuário
app.post("/users", async (request, response) => {
    const user = await prisma.user.create({
        data: request.body
    });
    response.json(user);
});

// Rota para listar todos os usuários
app.get("/users", async (request, response) => {
    const users = await prisma.user.findMany();
    response.json(users);
});

// Rota para listar um usuário
app.get("/users/:id", async (request, response) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        return response.status(404).json({
            error: "Usuário não encontrado"
        });
    }
    response.json(user);
});

// Rota para atualizar um usuário
app.put("/users/:id", async (request, response) => {
    const { id } = request.params;
    const user = await prisma.user.update({
        // where: { id: Number(id) },
        where: { id },
        data: request.body
    });
    response.json(user);
});

// Rota para excluir um usuário
app.delete("/users/:id", async (request, response) => {
    const { id } = request.params;
    await prisma.user.delete({
        where: { id: Number(id) }
    });
    response.sendStatus(204);
});

app.listen(port, () => {
    // console.log(`Servidor rodando em http://localhost:3300`);
    console.log(`Servidor rodando em http://${host}:${port}`);
});
