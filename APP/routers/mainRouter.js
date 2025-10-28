// APP/routers/mainRouter.js
const express = require('express');
const mainRouter = express.Router();

/* ------------------ CONTROLADORES ------------------ */
const estilosController       = require('../Controllers/controller.estilos.js');
const envaseTiposController   = require('../Controllers/controller.envaseTipos.js');
const inventarioController    = require('../Controllers/controller.inventarioEnvases.js');
const lotesController         = require('../Controllers/controller.lotes.js');
const movimientosController   = require('../Controllers/controller.movimientosEnvase.js');
const desperdiciosController  = require('../Controllers/controller.desperdicio.js');

// Helper para validar que existan las funciones
function chk(name, obj, fn) {
  if (!obj || typeof obj[fn] !== 'function') {
    console.error(`[ROUTER] FALTA función ${fn} en ${name}. Valor actual:`, obj ? typeof obj[fn] : obj);
    throw new Error(`Falta ${name}.${fn} (es undefined)`);
  }
}

/* ---- VALIDACIONES ANTES DE REGISTRAR RUTAS ---- */
chk('estilosController', estilosController, 'list');
chk('estilosController', estilosController, 'get');
chk('estilosController', estilosController, 'create');
chk('estilosController', estilosController, 'update');
chk('estilosController', estilosController, 'remove');

chk('envaseTiposController', envaseTiposController, 'list');
chk('envaseTiposController', envaseTiposController, 'get');
chk('envaseTiposController', envaseTiposController, 'create');
chk('envaseTiposController', envaseTiposController, 'update');
chk('envaseTiposController', envaseTiposController, 'remove');

chk('inventarioController', inventarioController, 'list');
chk('inventarioController', inventarioController, 'get');
chk('inventarioController', inventarioController, 'createOrSet'); // POST
chk('inventarioController', inventarioController, 'updateQty');   // PATCH

chk('lotesController', lotesController, 'list');
chk('lotesController', lotesController, 'get');
chk('lotesController', lotesController, 'create');
chk('lotesController', lotesController, 'update');
chk('lotesController', lotesController, 'remove');

chk('movimientosController', movimientosController, 'list');
chk('movimientosController', movimientosController, 'get');
chk('movimientosController', movimientosController, 'create');
chk('movimientosController', movimientosController, 'update');
chk('movimientosController', movimientosController, 'remove');

chk('desperdiciosController', desperdiciosController, 'list');
chk('desperdiciosController', desperdiciosController, 'get');
chk('desperdiciosController', desperdiciosController, 'create'); // POST
chk('desperdiciosController', desperdiciosController, 'update');
chk('desperdiciosController', desperdiciosController, 'remove');

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
mainRouter.put('/movimientos-envase/:id', movimientosController.update);
mainRouter.delete('/movimientos-envase/:id', movimientosController.remove);

/* --------------------- DESPERDICIOS --------------------- */
mainRouter.get('/desperdicios', desperdiciosController.list);
mainRouter.get('/desperdicios/:id', desperdiciosController.get);
mainRouter.post('/desperdicios', desperdiciosController.create);
mainRouter.put('/desperdicios/:id', desperdiciosController.update);
mainRouter.delete('/desperdicios/:id', desperdiciosController.remove);

module.exports = mainRouter;
