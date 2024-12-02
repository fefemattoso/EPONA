const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar um evento
const create = async (req, res) => {
    try {
        const { titulo, descricao, data, usuarioId } = req.body;
        const agenda = await prisma.agenda.create({
            data: {
                titulo,
                descricao,
                data,
                usuarioId,
            },
        });
        return res.status(201).json(agenda);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Buscar todos os eventos ou um evento específico
const read = async (req, res) => {
    try {
        if (req.params.id) {
            const agenda = await prisma.agenda.findUnique({
                where: { id: Number(req.params.id) },
            });
            if (agenda) {
                return res.json(agenda);
            } else {
                return res.status(404).json({ message: "Evento não encontrado" });
            }
        } else {
            const agendas = await prisma.agenda.findMany();
            return res.json(agendas);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Buscar eventos por ID do usuário
const readById = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const eventos = await prisma.agenda.findMany({
            where: { usuarioId: parseInt(usuarioId) },
        });
        return res.json(eventos);
    } catch (error) {
        return res.status(400).json({ message: "Erro ao localizar eventos do usuário" });
    }
};

// Buscar eventos próximos
const readUpcoming = async (req, res) => {
    try {
        const now = new Date();
        const eventosProximos = await prisma.agenda.findMany({
            where: {
                data: { gte: now }, // Eventos futuros
            },
            orderBy: { data: 'asc' },
        });
        return res.json(eventosProximos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Buscar eventos por data específica
const readByDate = async (req, res) => {
    try {
        const { usuarioId, data } = req.body;
        if (!usuarioId || !data) {
            return res.status(400).json({ message: "Usuário e data são obrigatórios" });
        }
        const eventos = await prisma.agenda.findMany({
            where: {
                usuarioId: parseInt(usuarioId),
                data: new Date(data), // Comparação direta com a data
            },
        });
        return res.json(eventos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Atualizar um evento
const update = async (req, res) => {
    try {
        const { id, titulo, descricao, data } = req.body;
        const agenda = await prisma.agenda.update({
            where: { id: Number(id) },
            data: { titulo, descricao, data },
        });
        return res.status(202).json(agenda);
    } catch (error) {
        return res.status(404).json({ message: "Evento não encontrado" });
    }
};

// Deletar um evento
const del = async (req, res) => {
    try {
        const { id } = req.params;
        const agenda = await prisma.agenda.delete({
            where: { id: parseInt(id) },
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ message: "Evento não encontrado" });
    }
};

module.exports = {
    create,
    read,
    readById,
    readUpcoming,
    readByDate,
    update,
    del,
};
