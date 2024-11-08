const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const { descricao, usuarioId, listaId } = req.body;
        const itemLista = await prisma.itemLista.create({
            data: {
                descricao: descricao,
                usuarioId: usuarioId,
                listaId: listaId,
            }
        });
        res.status(201).json(itemLista);
    } catch (e) {
        console.error(e);
        res.status(400).send('Erro:' + e.message);
    }
}

const read = async (req, res) => {
    if (req.params.id != undefined) {
        const id = parseInt(req.params.id);
        const itemLista = await prisma.itemLista.findUnique({
            where: {
                id: id
            }
        });
        res.status(200).json(itemLista);
    }
    else {
        const itemLista = await prisma.itemLista.findMany();
        res.status(200).json(itemLista);
    }
}

const readItensByLista = async (req, res) => {
    const listaId = parseInt(req.params.id);
    const itemLista = await prisma.itemLista.findMany({
        where: {
            listaId: listaId
        }
    });
    res.json(itemLista); 
}

const update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const itemLista = await prisma.itemLista.update({
            where: {
                id: id
            },
            data: {
                descricao: req.body.descricao
            }
        });
        res.status(202).json(itemLista);

    } catch (e) {
        console.error(e);
        res.status(400).send('Erro:' + e.message);
    }
}

const del = async (req, res) => {
    try {
        const itemLista = await prisma.itemLista.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.status(204).json(itemLista);
    } catch (e) {
        console.error(e);
        res.status(400).send('Erro:' + e.message);
    }

}

module.exports = {
    create,
    read,
    readItensByLista,
    update,
    del
};