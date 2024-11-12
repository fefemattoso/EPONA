const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const { id, titulo, usuarioId } = req.body;
        const lista = await prisma.listas.create({
            data: {
                id: id,
                titulo: titulo,
                usuarioId: usuarioId,
            }
        });
        return res.status(201).json(lista);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const read = async (req, res) => {
    if (req.params.id !== undefined) {
        const lista = await prisma.listas.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json(lista);
    } else {
        const listas = await prisma.listas.findMany();
        return res.json(listas);
    }
};

const readById = async (req, res) => {
    if (req.params.usuarioId !== undefined) {
        const usuarioId = req.params.usuarioId;
        const itens = await prisma.listas.findMany({
            where: {
                usuarioId: parseInt(usuarioId)
            }
        });
        return res.json(itens);
    } else {
        return res.status(400).json({ message: "Erro ao localizar ID do usuario" });
    }
}

const update = async (req, res) => {
    try {
        const id = req.params.id;
        const { usuarioId } = req.body;
        const lista = await prisma.listas.update({
            where: {
                id: parseInt(id)
            },
            data: {
                titulo,
                usuarioId,
            }
        });
        return res.status(202).json(lista);
    } catch (error) {
        return res.status(404).json({ message: "lista não encontrada" });
    }
};

const del = async (req, res) => {
    try {
        const lista = await prisma.listas.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.status(204).json(lista);
    } catch (error) {
        return res.status(404).json({ message: "lista não encontrada" + error });
    }
}

module.exports = {
    create,
    read,
    readById,
    update,
    del,
};