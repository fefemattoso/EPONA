const express = require("express");
const validaAcesso = require('./middleware/middleware')
const router = express.Router();

const Usuario = require('./controllers/usuario');
const Atividade = require('./controllers/atividades');
const Agenda = require('./controllers/agenda');
const Lista = require('./controllers/listas');

router.post('/login', Usuario.login)
router.post('/usuario', Usuario.create);
router.get('/usuario',validaAcesso, Usuario.read);
router.get('/usuario/:id', validaAcesso, Usuario.read);
router.put('/usuario',validaAcesso, Usuario.update);
router.delete('/usuario/:id',validaAcesso, Usuario.del);

router.post('/atividade', Atividade.create);
router.get('/atividade', Atividade.read);
router.get('/atividade/:id', Atividade.read);
router.put('/atividade', Atividade.update);
router.delete('/atividade/:id', Atividade.del);

router.post('/agenda', Agenda.create);
router.get('/agenda', Agenda.read);
router.get('/agenda/:id', Agenda.read);
router.put('/agenda', Agenda.update);
router.delete('/agenda/:id', Agenda.del);

router.post('/lista', Lista.create);
router.get('/lista', Lista.read);
router.get('/lista/:id', Lista.read);
router.put('/lista/:id', Lista.update);
router.delete('/lista/:id', Lista.del);

router.get('/', (req, res) => { return res.json("API respondendo") });

module.exports = router;