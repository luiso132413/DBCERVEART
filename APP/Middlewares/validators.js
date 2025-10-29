// app/Middlewares/validators.js
const { body, param, query, validationResult } = require('express-validator');

// Helper para responder errores de validación
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Formato compacto: solo los mensajes
    return res.status(400).json({
      ok: false,
      errors: errors.array().map(e => e.msg),
      details: errors.array()
    });
  }
  next();
};

/* ======================
   Estilo
====================== */
const validateEstilo = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ max: 100 }).withMessage('El nombre no debe exceder 100 caracteres')
    .trim(),
  body('descripcion')
    .optional({ nullable: true })
    .isString().withMessage('La descripción debe ser texto')
    .trim(),
  handleValidation
];

/* ======================
   Envase Tipo
====================== */
const validateEnvaseTipo = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser texto')
    .trim(),
  body('capacidad_ml')
    .notEmpty().withMessage('La capacidad_ml es requerida')
    .isFloat({ gt: 0 }).withMessage('La capacidad_ml debe ser numérica > 0')
    .toFloat(),
  body('material')
    .optional({ nullable: true })
    .isString().withMessage('El material debe ser texto')
    .trim(),
  handleValidation
];

/* ======================
   Lote
====================== */
const validateLote = [
  body('estilo_id')
    .notEmpty().withMessage('estilo_id es requerido')
    .isInt({ gt: 0 }).withMessage('estilo_id debe ser entero > 0')
    .toInt(),
  body('fecha_produccion')
    .notEmpty().withMessage('fecha_produccion es requerida')
    .isISO8601().withMessage('fecha_produccion debe tener formato de fecha válido (ISO 8601)')
    .toDate(),
  body('cantidad_litros')
    .notEmpty().withMessage('cantidad_litros es requerida')
    .isFloat({ gt: 0 }).withMessage('cantidad_litros debe ser > 0')
    .toFloat(),
  body('estado')
    .optional()
    .isIn(['EN_PROCESO', 'FERMENTANDO', 'MADURANDO', 'EMBOTELLADO', 'FINALIZADO', 'CANCELADO'])
    .withMessage('estado no es válido'),
  handleValidation
];

/* ======================
   Movimiento de Envases
====================== */
const validateMovimiento = [
  body('envase_tipo_id')
    .notEmpty().withMessage('envase_tipo_id es requerido')
    .isInt({ gt: 0 }).withMessage('envase_tipo_id debe ser entero > 0')
    .toInt(),
  body('tipo')
    .notEmpty().withMessage('tipo es requerido')
    .isIn(['IN', 'OUT']).withMessage('tipo debe ser IN u OUT'),
  body('cantidad')
    .notEmpty().withMessage('cantidad es requerida')
    .isInt({ gt: 0 }).withMessage('cantidad debe ser entero > 0')
    .toInt(),
  body('fecha')
    .optional()
    .isISO8601().withMessage('fecha debe ser una fecha válida (ISO 8601)')
    .toDate(),
  handleValidation
];

/* ======================
   Causa de Desperdicio
====================== */
const validateCausa = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser texto')
    .trim(),
  body('descripcion')
    .optional({ nullable: true })
    .isString().withMessage('La descripción debe ser texto')
    .trim(),
  handleValidation
];

/* ======================
   Registro de Desperdicio
====================== */
const validateDesperdicio = [
  body('lote_id')
    .notEmpty().withMessage('lote_id es requerido')
    .isInt({ gt: 0 }).withMessage('lote_id debe ser entero > 0')
    .toInt(),
  body('causa_id')
    .notEmpty().withMessage('causa_id es requerido')
    .isInt({ gt: 0 }).withMessage('causa_id debe ser entero > 0')
    .toInt(),
  body('cantidad_litros')
    .notEmpty().withMessage('cantidad_litros es requerida')
    .isFloat({ gt: 0 }).withMessage('cantidad_litros debe ser > 0')
    .toFloat(),
  body('fecha')
    .optional()
    .isISO8601().withMessage('fecha debe ser una fecha válida (ISO 8601)')
    .toDate(),
  body('comentario')
    .optional({ nullable: true })
    .isString().withMessage('comentario debe ser texto')
    .trim(),
  handleValidation
];

module.exports = {
  validateEstilo,
  validateEnvaseTipo,
  validateLote,
  validateMovimiento,
  validateCausa,
  validateDesperdicio,
};
