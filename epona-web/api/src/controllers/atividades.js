const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const { titulo, descricao, usuarioId, data } = req.body;
        const atividades = await prisma.atividade.create({
            data: {
                titulo: titulo,
                descricao: descricao,
                usuarioId: usuarioId,
                data: data
            }
        });
        return res.status(201).json(atividades);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const read = async (req, res) => {
    if (req.params.id !== undefined) {
        const atividades = await prisma.atividade.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json(atividades);
    } else {
        const atividades = await prisma.atividade.findMany();
        return res.json(atividades);
    }
};

const readById = async (req, res) => {
    if(req.params.usuarioId !== undefined){
        const usuarioId = req.params.usuarioId;
        const atividades = await prisma.atividade.findMany({
            where: {
                usuarioId: parseInt(usuarioId)
            }
        });
        return res.json(atividades);
    } else {
        return res.status(400).json({ message: "Erro ao localizar ID do usuario" });
    }
}

const update = async (req, res) => {
    console.log('Requisição de atualização recebida:', req.body); // Logando a requisição

    const { titulo, descricao, concluido } = req.body; // Extraindo dados do corpo da requisição
    try {
        const atividade = await prisma.atividade.update({
            where:{
                id: parseInt(req.params.id)
            },
            data: { titulo, descricao, concluido } // Verifique se 'concluida' está incluída aqui
        });
        console.log('Atividade atualizada:', atividade); // Logando a atividade atualizada
        return res.status(202).json(atividade);
    } catch (error) {
        console.error('Erro ao atualizar atividade:', error); // Logando o erro
        return res.status(404).json({ message: "Atividade não encontrada" });
    }
};





const del = async (req, res) => {
    try {
        const atividades = await prisma.atividade.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.status(204).json(atividades);
    } catch (error) {
        return res.status(404).json({ message: "atividade não encontrado" });
    }
}

module.exports = {
    create,
    read,
    readById,
    update,
    del,
};