// Archivo: validators.js
// Descripción: Validaciones del backend con express-validator.
// Aquí controlo que los datos que entran a cada endpoint sean correctos antes de llegar al controlador.

const { body, validationResult } = require('express-validator');

// Middleware general para manejar los errores de validación.
// Si algo no cumple con las reglas definidas, devuelvo todos los errores en formato claro.
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

/* ESTILO
   Validaciones para los estilos de cerveza (ej: IPA, Lager, etc.)*/
const validateEstilo = [
  body('nombre')
    // Debe existir y ser texto legible
    .notEmpty().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ max: 100 }).withMessage('El nombre no debe exceder 100 caracteres')
    .trim(),
  body('abv')
    // Porcentaje de alcohol, si se indica, debe estar entre 0 y 100
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 100 }).withMessage('abv debe estar entre 0 y 100')
    .toFloat(),
  body('notas')
    // Campo opcional para detalles o descripciones
    .optional({ nullable: true })
    .isString().withMessage('notas debe ser texto')
    .trim(),
  handleValidation
];

/* ENVASE TIPO
   Define el tipo de envase (botella, barril, lata, etc.)*/
const validateEnvaseTipo = [
  body('nombre')
    // El nombre no puede estar vacío y debe ser texto
    .notEmpty().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser texto')
    .trim(),
  body('capacidad_ml')
    // Capacidad en mililitros, debe ser un número positivo
    .notEmpty().withMessage('La capacidad_ml es requerida')
    .isFloat({ gt: 0 }).withMessage('La capacidad_ml debe ser numérica > 0')
    .toFloat(),
  handleValidation
];

/* LOTE
   Datos principales de cada lote de producción*/
const validateLote = [
  body('codigo')
    // Código identificador del lote, texto corto y obligatorio
    .notEmpty().withMessage('El código es requerido')
    .isString().withMessage('El código debe ser texto')
    .isLength({ max: 50 }).withMessage('El código no debe exceder 50 caracteres')
    .trim(),
  body('estilo_id')
    // Debe vincularse con un estilo válido
    .notEmpty().withMessage('estilo_id es requerido')
    .isInt({ gt: 0 }).withMessage('estilo_id debe ser entero > 0')
    .toInt(),
  body('fecha_inicio')
    // Fecha de inicio obligatoria, en formato ISO
    .notEmpty().withMessage('fecha_inicio es requerida')
    .isISO8601().withMessage('fecha_inicio debe tener formato de fecha válido (ISO 8601)')
    .toDate(),
  body('fecha_fin')
    // Fecha final opcional, pero debe tener formato válido si se incluye
    .optional({ nullable: true })
    .isISO8601().withMessage('fecha_fin debe tener formato de fecha válido (ISO 8601)')
    .toDate(),
  body('volumen_producido_litros')
    // Cantidad producida, siempre mayor que cero
    .notEmpty().withMessage('volumen_producido_litros es requerido')
    .isFloat({ gt: 0 }).withMessage('volumen_producido_litros debe ser > 0')
    .toFloat(),
  body('estado')
    // Solo se aceptan los estados definidos
    .notEmpty().withMessage('estado es requerido')
    .isIn(['En proceso', 'Finalizado', 'Cancelado']).withMessage('estado no es válido'),
  handleValidation
];

/* MOVIMIENTO DE ENVASES
   Entradas, salidas o ajustes de inventario*/
const validateMovimiento = [
  body('envase_tipo_id')
    // Se debe indicar qué tipo de envase se está moviendo
    .notEmpty().withMessage('envase_tipo_id es requerido')
    .isInt({ gt: 0 }).withMessage('envase_tipo_id debe ser entero > 0')
    .toInt(),
  body('tipo')
    // Puede ser ENTRADA, SALIDA o AJUSTE (sin importar si viene en minúsculas)
    .notEmpty().withMessage('tipo es requerido')
    .customSanitizer(v => String(v).trim().toUpperCase())
    .isIn(['ENTRADA', 'SALIDA', 'AJUSTE']).withMessage('tipo debe ser ENTRADA, SALIDA o AJUSTE'),
  body('cantidad')
    // La cantidad debe ser un número entero mayor que cero
    .notEmpty().withMessage('cantidad es requerida')
    .isInt({ gt: 0 }).withMessage('cantidad debe ser entero > 0')
    .toInt(),
  body('fecha')
    // Si se manda una fecha, debe ser válida
    .optional()
    .isISO8601().withMessage('fecha debe ser una fecha válida (ISO 8601)')
    .toDate(),
  body('detalle')
    // Campo opcional para comentarios o detalles del movimiento
    .optional({ nullable: true })
    .isString().withMessage('detalle debe ser texto')
    .trim(),
  handleValidation
];

/* CAUSA DE DESPERDICIO
   Catálogo de razones por las que puede haber desperdicio*/
const validateCausa = [
  body('nombre')
    // Nombre obligatorio para identificar la causa
    .notEmpty().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser texto')
    .trim(),
  body('descripcion')
    // Descripción opcional para más contexto
    .optional({ nullable: true })
    .isString().withMessage('La descripción debe ser texto')
    .trim(),
  handleValidation
];

/* 
   REGISTRO DE DESPERDICIO
   Registro individual de pérdidas o desperdicio en la producción*/
const validateDesperdicio = [
  body('lote_id')
    // Debe vincularse con un lote existente
    .notEmpty().withMessage('lote_id es requerido')
    .isInt({ gt: 0 }).withMessage('lote_id debe ser entero > 0')
    .toInt(),
  body('causa_id')
    // Debe vincularse con una causa válida
    .notEmpty().withMessage('causa_id es requerido')
    .isInt({ gt: 0 }).withMessage('causa_id debe ser entero > 0')
    .toInt(),
  body('cantidad_litros')
    // Cantidad desperdiciada en litros, siempre mayor que cero
    .notEmpty().withMessage('cantidad_litros es requerida')
    .isFloat({ gt: 0 }).withMessage('cantidad_litros debe ser > 0')
    .toFloat(),
  body('fecha')
    // Fecha opcional, debe ser válida si se envía
    .optional()
    .isISO8601().withMessage('fecha debe ser una fecha válida (ISO 8601)')
    .toDate(),
  body('notas')
    // Comentarios adicionales, opcionales
    .optional({ nullable: true })
    .isString().withMessage('notas debe ser texto')
    .trim(),
  handleValidation
];

// Exporto todos los esquemas para usarlos en las rutas
module.exports = {
  validateEstilo,
  validateEnvaseTipo,
  validateLote,
  validateMovimiento,
  validateCausa,
  validateDesperdicio
};
