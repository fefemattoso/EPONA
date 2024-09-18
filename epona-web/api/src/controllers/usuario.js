const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res) => {
    const { email, senha } = req.body;
    const usuario = await prisma.usuario.findFirst({
        where: { email, senha },
        select: { id: true, nome: true, email: true }
    });

    if (usuario) {
        const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.KEY, {
                expiresIn: 120 
            });
        usuario.token = token;
        return res.json(usuario);
    } else {
        return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }
};

const create = async (req, res) => {
    try {
        const { nome, email, senha, nascimento } = req.body;
        const usuario = await prisma.usuario.create({
            data: { nome, email, senha, nascimento }
        });
        return res.status(201).json(usuario);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const read = async (req, res) => {
    if (req.params.id) {
        const usuario = await prisma.usuario.findUnique({ where: { id: Number(req.params.id) } });
        return res.json(usuario);
    } else {
        const usuarios = await prisma.usuario.findMany();
        return res.json(usuarios);
    }
};

const update = async (req, res) => {
    try {
        const usuario = await prisma.usuario.update({
            where: { id: req.body.id },
            data: req.body
        });
        return res.status(202).json(usuario);
    } catch (error) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }
};

const del = async (req, res) => {
    try {
        await prisma.usuario.delete({ where: { id: parseInt(req.params.id) } });
        return res.status(204).json({});
    } catch (error) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }
};

module.exports = { create, read, update, del, login };
