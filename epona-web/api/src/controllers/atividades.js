const cron = require('node-cron'); // Dependencia usada para fazer com que toda meia noite o concluido de atividades seja alterado para false
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Agendamento diário para a meia-noite
cron.schedule('0 0 * * *', async () => {
    console.log('Atualizando atividades para false à meia-noite...');
    try {
        await prisma.atividade.updateMany({
            where: { concluido: true },
            data: { concluido: false }
        });
        console.log('Atualização concluída com sucesso.');
    } catch (error) {
        console.error('Erro ao atualizar atividades:', error);
    }
});

cron.schedule('12 11 * * *', async () => {
    console.log('Atualizando atividades para false à meia-noite...');
    try {
        await prisma.atividade.updateMany({
            where: { concluido: true },
            data: { concluido: false }
        });
        console.log('Atualização concluída com sucesso.');
    } catch (error) {
        console.error('Erro ao atualizar atividades:', error);
    }
});

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
    try {
        const { concluido } = req.body; // Verifica se o status foi alterado para 'concluido'
        const atividadeId = parseInt(req.params.id);

        // Obtenha a atividade existente
        const atividade = await prisma.atividade.findUnique({
            where: { id: atividadeId }
        });

        if (!atividade) {
            return res.status(404).json({ message: "Atividade não encontrada" });
        }

        // Verifica se a atividade está sendo marcada como 'concluido: true'
        if (!atividade.concluido && concluido) {
            // Atualiza a atividade e a pontuação do usuário em uma única transação
            await prisma.$transaction([
                prisma.atividade.update({
                    where: { id: atividadeId },
                    data: { concluido: true }
                }),
                prisma.usuario.update({
                    where: { id: atividade.usuarioId },
                    data: { pontuacao: { increment: 10 } }
                })
            ]);

            return res.status(200).json({ message: "Atividade concluída e pontuação atualizada!" });
        }

        // Atualiza apenas a atividade se não for uma mudança para 'concluido: true'
        const atividadeAtualizada = await prisma.atividade.update({
            where: { id: atividadeId },
            data: { concluido }
        });

        return res.status(200).json(atividadeAtualizada);
    } catch (error) {
        console.error("Erro ao atualizar atividade:", error);
        return res.status(500).json({ message: "Erro ao atualizar atividade" });
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