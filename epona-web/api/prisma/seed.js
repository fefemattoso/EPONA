const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const atividades = require("./seed/atividades.json");
const listas = require("./seed/listas.json");
const agendas = require("./seed/agendas.json");
const usuarios = require("./seed/usuarios.json");

async function main() {
    for (const usuario of usuarios) {
        await prisma.usuario.create({
            data: usuario
        });
    }
    for (const atividade of atividades) {
        await prisma.atividade.create({
            data: atividade
        });
    }
    for (const lista of listas) {
        await prisma.lista.create({
            data: lista
        });
    }
    for (const agenda of agendas) {
        await prisma.agenda.create({
            data: agenda
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
        console.log('Seed complete');
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });