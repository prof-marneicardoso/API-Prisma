import userModel from "../models/userModel.js";

// Cadastrar novo usuário
const registerUser = async (request, response) => {
    const { name, email, password } = request.body;

    try {
        const user = await userModel.registerUserService({
            name,
            email,
            password,
        });

        const { password: _, ...userWithoutPassword } = user;

        return response.status(201).json({
            message: "Usuário cadastrado com sucesso!",
            user: userWithoutPassword,
        });
    
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Erro interno no servidor.";
        console.error(error);
        return response.status(status).json({ message });
    }
};

// Listar todos os usuários
const listAllUsers = async (request, response) => {
    try {
        const users = await userModel.listAllUsersService();
        const usersWithoutPasswords = users.map(
            ({ password, ...user }) => user
        );
        return response.status(200).json(usersWithoutPasswords);

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Erro ao listar usuários.";
        return response.status(status).json({ message });
    }
};

// Listar usuário por ID
const listUserById = async (request, response) => {
    const { id } = request.params;

    try {
        const user = await userModel.listUserService(id);
        const { password: _, ...userWithoutPassword } = user;
        return response.status(200).json(userWithoutPassword);
    
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Erro ao buscar usuário.";
        return response.status(status).json({ message });
    }
};

// Atualizar usuário
const updateUser = async (request, response) => {
    const { id } = request.params;
    const { name, email, password } = request.body;

    try {
        const updatedUser = await userModel.updateUserService(id, {
            name,
            email,
            password,
        });

        const { password: _, ...userWithoutPassword } = updatedUser;
        return response.status(200).json({
            message: "Usuário atualizado com sucesso!",
            user: userWithoutPassword,
        });
    
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Erro ao atualizar usuário.";
        return response.status(status).json({ message });
    }
};

// Deletar usuário
const deleteUser = async (request, response) => {
    const { id } = request.params;

    try {
        const result = await userModel.deleteUserService(id);
        return response.status(200).json(result);
    
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Erro ao excluir usuário.";
        return response.status(status).json({ message });
    }
};

export default {
    registerUser,
    listAllUsers,
    listUserById,
    updateUser,
    deleteUser,
};
