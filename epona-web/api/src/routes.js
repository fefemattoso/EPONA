const express = require("express");
const validaAcesso = require('./middleware/middleware')
const router = express.Router();

const Usuario = require('./controllers/usuario');
const Atividade = require('./controllers/atividades');
const Agenda = require('./controllers/agenda');
const Lista = require('./controllers/listas');
const itemLista = require('./controllers/itemLista');
const notas = require('./controllers/notas');

//Rotas sem valida acesso

router.put('/senha',Usuario.senha)
router.post('/login', Usuario.login)
router.post('/usuario', Usuario.create);
router.get('/usuario', Usuario.read);
router.get('/usuario/:id', Usuario.read);

//Rotas que precisam de ,validaAcesso (estão sem para facilitar o progesso de programação)
router.get('/ranking',validaAcesso, Usuario.readPontuacao);
router.get('/ranking/:id',validaAcesso, Usuario.readPontuacao);
router.put('/usuario',validaAcesso, Usuario.update);
router.delete('/usuario/:id',validaAcesso, Usuario.del);

router.post('/atividade',validaAcesso, Atividade.create);
router.get('/atividade',validaAcesso, Atividade.read);
router.get('/atividade/:id',validaAcesso, Atividade.read);
router.get('/atividadeusuario/:usuarioId',validaAcesso, Atividade.readById);
router.put('/atividade/:id',validaAcesso, Atividade.update);
router.delete('/atividade/:id',validaAcesso, Atividade.del);

router.post('/agenda',validaAcesso, Agenda.create);
router.get('/agenda',validaAcesso, Agenda.read);
router.get('/agenda/:id',validaAcesso, Agenda.read);
router.get('/agendas/proximos',validaAcesso, Agenda.readUpcoming);
router.get('/agendausuario/:usuarioId',validaAcesso, Agenda.readById);
router.put('/agenda/:id',validaAcesso, Agenda.update);
router.delete('/agenda/:id',validaAcesso, Agenda.del);


router.post('/lista',validaAcesso, Lista.create);
router.get('/lista',validaAcesso ,Lista.read);
router.get('/lista/:id',validaAcesso, Lista.read);
router.get('/listausuario/:usuarioId',validaAcesso, Lista.readById);
router.put('/lista/:id',validaAcesso, Lista.update);
router.delete('/lista/:id',validaAcesso, Lista.del);

router.post('/itemLista',validaAcesso, itemLista.create);
router.get('/itemLista',validaAcesso, itemLista.read);
router.get('/itemLista/:id',validaAcesso, itemLista.read);
router.get('/itemLista/lista/:id',validaAcesso, itemLista.readItensByLista);
router.put('/itemLista/:id',validaAcesso, itemLista.update);
router.delete('/itemLista/:id',validaAcesso, itemLista.del);

router.post('/notas',validaAcesso, notas.create);
router.get('/notas',validaAcesso, notas.read);
router.get('/notas/:id',validaAcesso, notas.read);
router.put('/notas/:id',validaAcesso, notas.update);
router.delete('/notas/:id',validaAcesso, notas.del);

router.get('/', (req, res) => { return res.json("API respondendo") });

module.exports = router;