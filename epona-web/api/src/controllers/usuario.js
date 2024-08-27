const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const { id, nome, email, senha, nascimento, criadoEm } = req.body;
        const usuario = await prisma.usuario.create({
            data: {
                id: id,
                nome: nome,
                email: email,
                senha: senha,
                nascimento: nascimento,
                criadoEm: criadoEm
            }
        });
        return res.status(201).json(usuario);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const read = async (req, res) => {
    if (req.params.id !== undefined) {
        const usuario = await prisma.usuario.findUnique({
            where: {
               id: Number(req.params.id)
            }
        });
        return res.json(usuario);
    } else {
        const usuarios = await prisma.usuario.findMany();
        return res.json(usuarios);
    }
};

const update = async (req, res) => {
    try {
        const usuario = await prisma.usuario.update({
            where: {
               id: req.body.id
            },
            data: req.body
        });
        return res.status(202).json(usuario);
    } catch (error) {
        return res.status(404).json({ message: "usuario não encontrado" });
    }
};

const del = async (req, res) => {
    try {
        const usuario = await prisma.usuario.delete({
            where: {
               id: parseInt(req.params.id)
            }
        });
        return res.status(204).json(usuario);
    } catch (error) {
        return res.status(404).json({ message: "usuario não encontrado" });
    }
}

module.exports = {
    create,
    read,
    update,
    del
};