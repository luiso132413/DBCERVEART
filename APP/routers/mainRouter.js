// APP/routers/mainRouter.js
const express = require('express');
const mainRouter = express.Router();

/* ------------------ CONTROLADOR UNIFICADO ------------------ */
/**
 * Asegúrate de que la ruta y mayúsculas/minúsculas coincidan con tu proyecto:
 *  - Si tu carpeta es "controllers":  '../controllers/main.controllers'
 *  - Si es "Controllers":             '../Controllers/main.controllers'
 */
const c = require('../controllers/main.controllers'); // <— ajusta esta ruta si tu carpeta se llama distinto

/* --------------------- ESTILOS --------------------- */
mainRouter.get('/estilos', c.estilos.list);
mainRouter.get('/estilos/:id', c.estilos.get);
mainRouter.post('/estilos', c.estilos.create);
mainRouter.put('/estilos/:id', c.estilos.update);
mainRouter.delete('/estilos/:id', c.estilos.remove);

/* --------------------- ENVASES --------------------- */
mainRouter.get('/envase-tipos', c.envaseTipos.list);
mainRouter.get('/envase-tipos/:id', c.envaseTipos.get);
mainRouter.post('/envase-tipos', c.envaseTipos.create);
mainRouter.put('/envase-tipos/:id', c.envaseTipos.update);
mainRouter.delete('/envase-tipos/:id', c.envaseTipos.remove);

/* --------------- INVENTARIO DE ENVASES --------------- */
/**
 * OJO: En el controller unificado los métodos son: list/get/create/update/remove
 * y el GET por id usa el PK (id_inventario_envase), no id_envase_tipo.
 * Si antes usabas :id_envase_tipo, cámbialo a :id (PK) como aquí.
 */
mainRouter.get('/inventario-envases', c.inventarioEnvase.list);
mainRouter.get('/inventario-envases/:id', c.inventarioEnvase.get);
mainRouter.post('/inventario-envases', c.inventarioEnvase.create);
mainRouter.put('/inventario-envases/:id', c.inventarioEnvase.update);
mainRouter.delete('/inventario-envases/:id', c.inventarioEnvase.remove);

/* ----------------------- LOTES ----------------------- */
mainRouter.get('/lotes', c.lotes.list);
mainRouter.get('/lotes/:id', c.lotes.get);
mainRouter.post('/lotes', c.lotes.create);
mainRouter.put('/lotes/:id', c.lotes.update);
mainRouter.delete('/lotes/:id', c.lotes.remove);

/* ------------- MOVIMIENTOS DE ENVASES --------------- */
/**
 * En el controller, update/remove responden 405 por seguridad (no se permite editar/borrar movimientos ya aplicados).
 * Si luego quieres habilitarlos con lógica de revertir stock, lo vemos.
 */
mainRouter.get('/movimientos-envase', c.movimientosEnvase.list);
mainRouter.get('/movimientos-envase/:id', c.movimientosEnvase.get);
mainRouter.post('/movimientos-envase', c.movimientosEnvase.create);
mainRouter.put('/movimientos-envase/:id', c.movimientosEnvase.update);
mainRouter.delete('/movimientos-envase/:id', c.movimientosEnvase.remove);

/* --------------------- DESPERDICIOS --------------------- */
mainRouter.get('/desperdicios', c.desperdicios.list);
mainRouter.get('/desperdicios/:id', c.desperdicios.get);
mainRouter.post('/desperdicios', c.desperdicios.create);
mainRouter.put('/desperdicios/:id', c.desperdicios.update);
mainRouter.delete('/desperdicios/:id', c.desperdicios.remove);

module.exports = mainRouter;
