let express = require('express');
let mainRouter = express.Router();

// Controladores
const estilosController = require('../Controllers/controller.estilos.js');
const envaseTiposController = require('../Controllers/controller.envaseTipos.js');
const inventarioController = require('../Controllers/controller.inventarioEnvases.js');
const lotesController = require('../Controllers/controller.lotes.js');
const movimientosController = require('../Controllers/controller.movimientosEnvase.js');
const causasDesperdicioController = require('../Controllers/controller.causasDesperdicio.js');
const desperdiciosController = require('../Controllers/controller.desperdicio.js');

/* --------------------- ESTILOS --------------------- */
mainRouter.get('/estilos', estilosController.list);
mainRouter.get('/estilos/:id', estilosController.get);
mainRouter.post('/estilos', estilosController.create);
mainRouter.put('/estilos/:id', estilosController.update);
mainRouter.delete('/estilos/:id', estilosController.remove);

/* --------------------- ENVASES --------------------- */
mainRouter.get('/envase-tipos', envaseTiposController.list);
mainRouter.get('/envase-tipos/:id', envaseTiposController.get);
mainRouter.post('/envase-tipos', envaseTiposController.create);
mainRouter.put('/envase-tipos/:id', envaseTiposController.update);
mainRouter.delete('/envase-tipos/:id', envaseTiposController.remove);

/* --------------- INVENTARIO DE ENVASES --------------- */
mainRouter.get('/inventario-envases', inventarioController.list);
mainRouter.get('/inventario-envases/:id_envase_tipo', inventarioController.get);
mainRouter.post('/inventario-envases', inventarioController.createOrSet);
mainRouter.patch('/inventario-envases/:id_envase_tipo', inventarioController.updateQty);

/* ----------------------- LOTES ----------------------- */
mainRouter.get('/lotes', lotesController.list);
mainRouter.get('/lotes/:id', lotesController.get);
mainRouter.post('/lotes', lotesController.create);
mainRouter.put('/lotes/:id', lotesController.update);
mainRouter.delete('/lotes/:id', lotesController.remove);

/* ------------- MOVIMIENTOS DE ENVASES --------------- */
mainRouter.get('/movimientos-envase', movimientosController.list);
mainRouter.get('/movimientos-envase/:id', movimientosController.get);
mainRouter.post('/movimientos-envase', movimientosController.create);

/* ------------- CAUSAS DE DESPERDICIO --------------- */
mainRouter.get('/causas-desperdicio', causasDesperdicioController.list);
mainRouter.get('/causas-desperdicio/:id', causasDesperdicioController.get);
mainRouter.post('/causas-desperdicio', causasDesperdicioController.create);
mainRouter.put('/causas-desperdicio/:id', causasDesperdicioController.update);
mainRouter.delete('/causas-desperdicio/:id', causasDesperdicioController.remove);

/* --------------------- DESPERDICIOS --------------------- */
mainRouter.get('/desperdicios', desperdiciosController.list);
mainRouter.get('/desperdicios/:id', desperdiciosController.get);
mainRouter.post('/desperdicios', desperdiciosController.create);
mainRouter.put('/desperdicios/:id', desperdiciosController.update);
mainRouter.delete('/desperdicios/:id', desperdiciosController.remove);

module.exports = mainRouter;
