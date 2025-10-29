const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.array().map(e => e.msg),
      details: errors.array()
    });
  }
  next();
};

/* ======================
   ESTILO
====================== */
const validateEstilo = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ max: 100 }).withMessage('El nombre no debe exceder 100 caracteres')
    .trim(),
  body('abv')
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 100 }).withMessage('abv debe estar entre 0 y 100')
    .toFloat(),
  body('notas')
    .optional({ nullable: true })
    .isString().withMessage('notas debe ser texto')
    .trim(),
  handleValidation
];

/* ======================
   ENVASE TIPO
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
  handleValidation
];

/* ======================
   LOTE
====================== */
const validateLote = [
  body('codigo')
    .notEmpty().withMessage('El código es requerido')
    .isString().withMessage('El código debe ser texto')
    .isLength({ max: 50 }).withMessage('El código no debe exceder 50 caracteres')
    .trim(),
  body('estilo_id')
    .notEmpty().withMessage('estilo_id es requerido')
    .isInt({ gt: 0 }).withMessage('estilo_id debe ser entero > 0')
    .toInt(),
  body('fecha_inicio')
    .notEmpty().withMessage('fecha_inicio es requerida')
    .isISO8601().withMessage('fecha_inicio debe tener formato de fecha válido (ISO 8601)')
    .toDate(),
  body('fecha_fin')
    .optional({ nullable: true })
    .isISO8601().withMessage('fecha_fin debe tener formato de fecha válido (ISO 8601)')
    .toDate(),
  body('volumen_producido_litros')
    .notEmpty().withMessage('volumen_producido_litros es requerido')
    .isFloat({ gt: 0 }).withMessage('volumen_producido_litros debe ser > 0')
    .toFloat(),
  body('estado')
    .notEmpty().withMessage('estado es requerido')
    .isIn(['En proceso', 'Finalizado', 'Cancelado']).withMessage('estado no es válido'),
  handleValidation
];

/* ======================
   MOVIMIENTO DE ENVASES
====================== */
const validateMovimiento = [
  body('envase_tipo_id')
    .notEmpty().withMessage('envase_tipo_id es requerido')
    .isInt({ gt: 0 }).withMessage('envase_tipo_id debe ser entero > 0')
    .toInt(),
  body('tipo')
    .notEmpty().withMessage('tipo es requerido')
    .isIn(['Entrada', 'Salida', 'Ajuste']).withMessage('tipo debe ser Entrada, Salida o Ajuste'),
  body('cantidad')
    .notEmpty().withMessage('cantidad es requerida')
    .isInt({ gt: 0 }).withMessage('cantidad debe ser entero > 0')
    .toInt(),
  body('fecha')
    .optional()
    .isISO8601().withMessage('fecha debe ser una fecha válida (ISO 8601)')
    .toDate(),
  body('detalle')
    .optional({ nullable: true })
    .isString().withMessage('detalle debe ser texto')
    .trim(),
  handleValidation
];

/* ======================
   CAUSA DE DESPERDICIO
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
   REGISTRO DE DESPERDICIO
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
  body('notas')
    .optional({ nullable: true })
    .isString().withMessage('notas debe ser texto')
    .trim(),
  handleValidation
];

module.exports = {
  validateEstilo,
  validateEnvaseTipo,
  validateLote,
  validateMovimiento,
  validateCausa,
  validateDesperdicio
};
