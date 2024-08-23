const express = require("express");
const router = express.Router();

const Usuario = require('./controllers/usuario');
const Atividade = require('./controllers/atividades');
const Agenda = require('./controllers/agenda');
const Lista = require('./controllers/listas');

router.post('/usuario', Usuario.create);
router.get('/usuario', Usuario.read);
router.get('/usuario/:id', Usuario.read);
router.put('/usuario', Usuario.update);
router.delete('/usuario/:id', Usuario.del);

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