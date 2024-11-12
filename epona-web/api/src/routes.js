const express = require("express");
const validaAcesso = require('./middleware/middleware')
const router = express.Router();

const Usuario = require('./controllers/usuario');
const Atividade = require('./controllers/atividades');
const Agenda = require('./controllers/agenda');
const Lista = require('./controllers/listas');
const itemLista = require('./controllers/itemLista');
const notas = require('./controllers/notas');

router.put('/senha', Usuario.senha)

router.post('/login', Usuario.login)
router.post('/usuario', Usuario.create);
router.get('/usuario', Usuario.read);
router.get('/usuario/:id', Usuario.read);
router.put('/usuario', Usuario.update);
router.delete('/usuario/:id', Usuario.del);

router.post('/atividade', Atividade.create);
router.get('/atividade', Atividade.read);
router.get('/atividade/:id', Atividade.read);
router.get('/atividadeusuario/:usuarioId', Atividade.readById);
router.put('/atividade/:id', Atividade.update);
router.delete('/atividade/:id', Atividade.del);

router.post('/agenda', Agenda.create);
router.get('/agenda', Agenda.read);
router.get('/agenda/:id', Agenda.read);
router.get('/agendausuario/:usuarioId', Agenda.readById);
router.put('/agenda/:id', Agenda.update);
router.delete('/agenda/:id', Agenda.del);

router.post('/lista', Lista.create);
router.get('/lista', Lista.read);
router.get('/lista/:id', Lista.read);
router.get('/listausuario/:usuarioId', Lista.readById);
router.put('/lista/:id', Lista.update);
router.delete('/lista/:id', Lista.del);

router.post('/itemLista', itemLista.create);
router.get('/itemLista', itemLista.read);
router.get('/itemLista/:id', itemLista.read);
router.get('/itemLista/lista/:id', itemLista.readItensByLista);
router.put('/itemLista/:id', itemLista.update);
router.delete('/itemLista/:id', itemLista.del);

router.post('/notas', notas.create);
router.get('/notas', notas.read);
router.get('/notas/:id', notas.read);
router.put('/notas/:id', notas.update);
router.delete('/notas/:id', notas.del);

router.get('/', (req, res) => { return res.json("API respondendo") });

module.exports = router;