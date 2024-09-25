const express = require("express");
const validaAcesso = require('./middleware/middleware')
const router = express.Router();

const Usuario = require('./controllers/usuario');
const Atividade = require('./controllers/atividades');
const Agenda = require('./controllers/agenda');
const Lista = require('./controllers/listas');

router.post('/login', Usuario.login)
router.post('/usuario', Usuario.create);
router.get('/usuario', validaAcesso, Usuario.read);
router.get('/usuario/:id', validaAcesso, Usuario.read);
router.put('/usuario', validaAcesso, Usuario.update);
router.delete('/usuario/:id', validaAcesso, Usuario.del);

router.post('/atividade',validaAcesso, Atividade.create);
router.get('/atividade',validaAcesso, Atividade.read);
router.get('/atividade/:id', validaAcesso, Atividade.read);
router.get('/atividadeusuario/:usuarioId', validaAcesso, Atividade.readById);
router.put('/atividade/:id', validaAcesso, Atividade.update);
router.delete('/atividade/:id', validaAcesso, Atividade.del);

//Agenda está sem valida acesso pois ainda não funciona tentando pegar os lembretes pelos IDs dos usuarios
router.post('/agenda', Agenda.create);
router.get('/agenda', Agenda.read);
router.get('/agenda/:id', Agenda.read);
router.get('/agendausuario/:usuarioId',  Agenda.readById);
router.put('/agenda/:id', Agenda.update);
router.delete('/agenda/:id', Agenda.del);

router.post('/lista', validaAcesso, Lista.create);
router.get('/lista', validaAcesso, Lista.read);
router.get('/lista/:id', validaAcesso, Lista.read);
router.get('/listausuario/:usuarioId', validaAcesso, Lista.readById);
router.put('/lista/:id', validaAcesso, Lista.update);
router.delete('/lista/:id', validaAcesso, Lista.del);

router.get('/', (req, res) => { return res.json("API respondendo") });

module.exports = router;