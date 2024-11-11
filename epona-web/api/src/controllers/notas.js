const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const { titulo, descricao, usuarioId} = req.body;
        const notas = await prisma.notas.create({
            data: {
                titulo: titulo,
                descricao: descricao,
                usuarioId: usuarioId,
            }
        });
        res.status(201).json(notas);
    } catch (e) {
        console.error(e);
        res.status(400).send('Erro:' + e.message);
    }
}

const read = async (req, res) => {
    if (req.params.id != undefined) {
        const id = parseInt(req.params.id);
        const notas = await prisma.notas.findUnique({
            where: {
                id: id
            }
        });
        res.status(200).json(notas);
    }
    else {
        const notas = await prisma.notas.findMany();
        res.status(200).json(notas);
    }
}

const update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const notas = await prisma.notas.update({
            where: {
                id: id
            },
            data: {
                descricao: req.body.descricao
            }
        });
        res.status(202).json(notas);

    } catch (e) {
        console.error(e);
        res.status(400).send('Erro:' + e.message);
    }
}

const del = async (req, res) => {
    try {
        const notas = await prisma.notas.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.status(204).json(notas);
    } catch (e) {
        console.error(e);
        res.status(400).send('Erro:' + e.message);
    }

}

module.exports = {
    create,
    read,
    update,
    del
};