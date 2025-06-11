// # MODEL: REGRAS DE NEGOCIO + ACESSO AO DADOS

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Classe de erro personalizada para permitir status HTTP
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// 🔎 Verifica se o e-mail já foi utilizado
const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email
        },
    });
};

// Cadastrar novo usuário
const registerUserService = async ({ name, email, password }) => {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new AppError("E-mail já cadastrado.", 409);
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: passwordHashed,
        },
    });

    return user;
};

// Listar todos os usuários
const listAllUsersService = async () => {
    return await prisma.user.findMany();
};

// Listar apenas 1 usuário pelo ID
const listUserService = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(id)
        },
    });

    if (!user) {
        throw new AppError("Usuário não encontrado.", 404);
    }

    return user;
};

// Atualizar usuário
const updateUserService = async (id, { name, email, password }) => {
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!user) {
        throw new AppError("Usuário não encontrado para atualizar.", 404);
    }

    let passwordHashed = undefined;
    if (password) {
        passwordHashed = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: parseInt(id)
        },
        data: {
            name,
            email,
            ...(passwordHashed && {
                password: passwordHashed
            }),
        },
    });

    return updatedUser;
};

// Excluir usuário
const deleteUserService = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (!user) {
        throw new AppError("Usuário não encontrado para exclusão.", 404);
    }

    await prisma.user.delete({
        where: { id: parseInt(id) },
    });

    return {
        message: "Usuário excluído com sucesso."
    };
};

export default {
    registerUserService,
    listAllUsersService,
    listUserService,
    updateUserService,
    deleteUserService,
    findUserByEmail,
};
