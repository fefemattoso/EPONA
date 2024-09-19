const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const { id, descricao, usuarioId, concluido } = req.body;
        const lista = await prisma.lista.create({
            data: {
                id: id,
                descricao: descricao,
                usuarioId: usuarioId,
                concluido: concluido
            }
        });
        return res.status(201).json(lista);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const read = async (req, res) => {
    if (req.params.id !== undefined) {
        const lista = await prisma.lista.findUnique({
            where: {
               id: Number(req.params.id)
            }
        });
        return res.json(lista);
    } else {
        const listas = await prisma.lista.findMany();
        return res.json(listas);
    }
};

const readById = async (req, res) => {
    if(req.params.usuarioId !== undefined){
        const usuarioId = req.params.usuarioId;
        const itens = await prisma.lista.findMany({
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
      const { descricao, usuarioId, concluido } = req.body;
      const lista = await prisma.lista.update({
        where: {
          id: parseInt(id)
        },
        data: {
          descricao,
          usuarioId,
          concluido
        }
      });
      return res.status(202).json(lista);
    } catch (error) {
      return res.status(404).json({ message: "lista não encontrada" });
    }
  };

const del = async (req, res) => {
    try {
        const lista = await prisma.lista.delete({
            where: {
               id: parseInt(req.params.id)
            }
        });
        return res.status(204).json(lista);
    } catch (error) {
        return res.status(404).json({ message: "lista não encontrada" });
    }
}

module.exports = {
    create,
    read,
    readById,
    update,
    del,
};