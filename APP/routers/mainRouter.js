// Archivo: mainRouter.js
// Descripción: Define todas las rutas principales del sistema, agrupadas por entidad.
// Aquí conecto los controladores con sus validaciones y los endpoints que el frontend consume.

const express = require('express');
const mainRouter = express.Router();

// Controladores
const estiloController = require('../Controllers/Estilo.controller.js');
const envaseTipoController = require('../Controllers/envaseTipo.controller.js');
const loteController = require('../Controllers/lote.controller.js');
const movimientoEnvaseController = require('../Controllers/movimientoEnvase.controller.js');
const causaDesperdicioController = require('../Controllers/causaDesperdicio.controller.js');
const desperdicioController = require('../Controllers/desperdicio.controller.js');

// Middlewares de validación (uno por entidad)
const {
  validateEstilo,
  validateEnvaseTipo,
  validateLote,
  validateMovimiento,
  validateCausa,
  validateDesperdicio
} = require('../Middlewares/validators.js');

/* ESTILOS
   Gestión de los diferentes tipos de cerveza */
mainRouter.post('/api/estilos', validateEstilo, estiloController.createEstilo);
mainRouter.get('/api/estilos', estiloController.getEstilos);
mainRouter.get('/api/estilos/:id', estiloController.getEstiloById);
mainRouter.put('/api/estilos/:id', validateEstilo, estiloController.updateEstilo);
mainRouter.delete('/api/estilos/:id', estiloController.deleteEstilo);

/* ENVASES TIPO
   Catálogo de envases usados en producción */
mainRouter.post('/api/envases-tipo', validateEnvaseTipo, envaseTipoController.createEnvaseTipo);
mainRouter.get('/api/envases-tipo', envaseTipoController.getEnvasesTipo);
mainRouter.get('/api/envases-tipo/:id', envaseTipoController.getEnvaseTipoById);
mainRouter.put('/api/envases-tipo/:id', validateEnvaseTipo, envaseTipoController.updateEnvaseTipo);
mainRouter.delete('/api/envases-tipo/:id', envaseTipoController.deleteEnvaseTipo);

/* LOTES
   Registro y control de los lotes de producción */
mainRouter.post('/api/lotes', validateLote, loteController.createLote);
mainRouter.get('/api/lotes', loteController.getLotes);
mainRouter.get('/api/lotes/:id', loteController.getLoteById);
mainRouter.put('/api/lotes/:id', validateLote, loteController.updateLote);
mainRouter.patch('/api/lotes/:id/estado', loteController.cambiarEstadoLote);
mainRouter.delete('/api/lotes/:id', loteController.deleteLote);

/* MOVIMIENTOS DE ENVASES
   Entradas, salidas y ajustes del inventario de envases */
mainRouter.post('/api/movimientos', validateMovimiento, movimientoEnvaseController.createMovimiento);
mainRouter.get('/api/movimientos', movimientoEnvaseController.getMovimientos);
mainRouter.get('/api/movimientos/saldo', movimientoEnvaseController.getSaldo);
mainRouter.delete('/api/movimientos/:id', movimientoEnvaseController.deleteMovimiento);

/* CAUSAS DE DESPERDICIO
   Catálogo base para registrar pérdidas o desperdicios */
mainRouter.post('/api/causas', validateCausa, causaDesperdicioController.createCausa);
mainRouter.get('/api/causas', causaDesperdicioController.getCausas);
mainRouter.put('/api/causas/:id', validateCausa, causaDesperdicioController.updateCausa);
mainRouter.delete('/api/causas/:id', causaDesperdicioController.deleteCausa);

/* DESPERDICIOS
   Registros individuales de pérdidas en la producción */
mainRouter.post('/api/desperdicios', validateDesperdicio, desperdicioController.createDesperdicio);
mainRouter.get('/api/desperdicios', desperdicioController.getDesperdicios);
mainRouter.delete('/api/desperdicios/:id', desperdicioController.deleteDesperdicio);

module.exports = mainRouter;
