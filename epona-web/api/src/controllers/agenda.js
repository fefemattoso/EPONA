const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const { id, titulo, descricao, data, usuarioId } = req.body;
        const agenda = await prisma.agenda.create({
            data: {
                id: id,
                titulo: titulo,
                descricao: descricao,
                data: data,
                usuarioId: usuarioId
            }
        });
        return res.status(201).json(agenda);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const read = async (req, res) => {
    if (req.params.id !== undefined) {
        const agenda = await prisma.agenda.findUnique({
            where: {
               id: Number(req.params.id)
            }
        });
        return res.json(agenda);
    } else {
        const agendas = await prisma.agenda.findMany();
        return res.json(agendas);
    }
};

const readById = async (req, res) => {
    if(req.params.usuarioId !== undefined){
        const usuarioId = req.params.usuarioId;
        const lembretes = await prisma.lista.findMany({
            where: {
                usuarioId: parseInt(usuarioId)
            }
        });
        return res.json(lembretes);
    } else {
        return res.status(400).json({ message: "Erro ao localizar ID do usuario" });
    }
}

const update = async (req, res) => {
    try {
        const agenda = await prisma.agenda.update({
            where: {
               id: req.body.id
            },
            data: req.body
        });
        return res.status(202).json(agenda);
    } catch (error) {
        return res.status(404).json({ message: "agenda não encontrada" });
    }
};

const del = async (req, res) => {
    try {
        const agenda = await prisma.agenda.delete({
            where: {
               id: parseInt(req.params.id)
            }
        });
        return res.status(204).json(agenda);
    } catch (error) {
        return res.status(404).json({ message: "agenda não encontrada" });
    }
}

module.exports = {
    create,
    read,
    readById,
    update,
    del
};