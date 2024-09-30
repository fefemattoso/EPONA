const express = require("express");
const validaAcesso = require('./middleware/middleware')
const router = express.Router();

const Usuario = require('./controllers/usuario');
const Atividade = require('./controllers/atividades');
const Agenda = require('./controllers/agenda');
const Lista = require('./controllers/listas');

router.put('/senha', Usuario.senha)

router.post('/login', Usuario.login)
router.post('/usuario', Usuario.create);
router.get('/usuario', Usuario.read);
router.get('/usuario/:id', validaAcesso, Usuario.read);
router.put('/usuario', Usuario.update);
router.delete('/usuario/:id', validaAcesso, Usuario.del);

router.post('/atividade',validaAcesso, Atividade.create);
router.get('/atividade',validaAcesso, Atividade.read);
router.get('/atividade/:id', validaAcesso, Atividade.read);
router.get('/atividadeusuario/:usuarioId', validaAcesso, Atividade.readById);
router.put('/atividade/:id', validaAcesso, Atividade.update);
router.delete('/atividade/:id', validaAcesso, Atividade.del);

router.post('/agenda', validaAcesso, Agenda.create);
router.get('/agenda', validaAcesso, Agenda.read);
router.get('/agenda/:id', validaAcesso, Agenda.read);
router.get('/agendausuario/:usuarioId', validaAcesso, Agenda.readById);
router.put('/agenda/:id', validaAcesso, Agenda.update);
router.delete('/agenda/:id', validaAcesso, Agenda.del);

router.post('/lista', validaAcesso, Lista.create);
router.get('/lista', validaAcesso, Lista.read);
router.get('/lista/:id', validaAcesso, Lista.read);
router.get('/listausuario/:usuarioId', validaAcesso, Lista.readById);
router.put('/lista/:id', validaAcesso, Lista.update);
router.delete('/lista/:id', validaAcesso, Lista.del);

router.get('/', (req, res) => { return res.json("API respondendo") });

module.exports = router;