const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



const create = async (req, res) => {
    try {
        const { titulo, descricao, data} = req.body;
        const atividades = await prisma.atividade.create({
            data: {
                titulo: titulo,
                descricao: descricao,
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

const update = async (req, res) => {
    try {
        const atividades = await prisma.atividade.update({
            where: {
               id: req.body.id
            },
            data: req.body
        });
        return res.status(202).json(atividades);
    } catch (error) {
        return res.status(404).json({ message: "atividade não encontrado" });
    }
};

const del = async (req, res) => {
    try {
        const atividades = await prisma.atividade.delete({
            where: {
               id:  parseInt(req.params.id)
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
    update,
    del
};