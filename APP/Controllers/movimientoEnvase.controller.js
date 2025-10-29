// app/Controllers/movimientoEnvase.controller.js
const { MovimientoEnvase, EnvaseTipo, Lote, Sequelize } = require('../config/db.config');
const { validationResult } = require('express-validator');
const { fn, literal, Op } = Sequelize;

// Helper: stock por EnvaseTipo (y opcional Lote)
async function obtenerStock({ envase_tipo_id, lote_id = null }) {
  const where = { envase_tipo_id };
  if (lote_id != null) where.lote_id = lote_id;

  const rows = await MovimientoEnvase.findAll({
    where,
    attributes: [
      [
        fn(
          'SUM',
          literal(`
            CASE
              WHEN tipo = 'ENTRADA' THEN cantidad
              WHEN tipo = 'AJUSTE'  THEN cantidad
              WHEN tipo = 'SALIDA'  THEN -cantidad
              ELSE 0
            END
          `)
        ),
        'saldo'
      ]
    ]
  });

  const saldo = parseInt(rows?.[0]?.get('saldo') ?? 0, 10);
  return Number.isNaN(saldo) ? 0 : saldo;
}

exports.createMovimiento = async (req, res) => {
  // Validación de express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, errors: errors.array() });
  }

  try {
    // ✨ Normalización y tipado seguro
    const tipo = String(req.body.tipo || '').trim().toUpperCase();
    const envase_tipo_id = Number(req.body.envase_tipo_id);
    const lote_id = req.body.lote_id != null ? Number(req.body.lote_id) : null;
    const cantidad = Number(req.body.cantidad);
    const fecha = req.body.fecha ? new Date(req.body.fecha) : new Date();
    const detalle = req.body.detalle ? String(req.body.detalle) : null;

    if (!['ENTRADA', 'SALIDA', 'AJUSTE'].includes(tipo)) {
      return res.status(400).json({ ok: false, error: 'Tipo inválido' });
    }

    // FKs
    const envase = await EnvaseTipo.findByPk(envase_tipo_id);
    if (!envase) return res.status(400).json({ ok: false, error: 'EnvaseTipo inválido' });

    if (lote_id != null) {
      const lote = await Lote.findByPk(lote_id);
      if (!lote) return res.status(400).json({ ok: false, error: 'Lote inválido' });
    }

    // Validación de stock para SALIDA
    if (tipo === 'SALIDA') {
      const stockActual = await obtenerStock({ envase_tipo_id, lote_id });
      if (stockActual < cantidad) {
        return res.status(400).json({
          ok: false,
          error: `Stock insuficiente. Disponible: ${stockActual}`
        });
      }
    }

    // Crear movimiento
    const mov = await MovimientoEnvase.create({
      fecha,
      tipo,
      envase_tipo_id,
      lote_id,
      cantidad,
      detalle
    });

    const saldo = await obtenerStock({ envase_tipo_id, lote_id });

    return res.status(201).json({
      ok: true,
      message: 'Movimiento registrado',
      movimiento: mov,
      saldo_actual: saldo,
      scope: { envase_tipo_id, lote_id }
    });
  } catch (error) {
    // Log útil (incluye mensaje SQL si viene de Sequelize/tedious)
    console.error(
      'Error createMovimiento:',
      error?.message,
      error?.original?.message || '',
      error?.stack || ''
    );
    return res.status(500).json({
      ok: false,
      error: 'Error interno del servidor',
      detail: error?.original?.message || error?.message
    });
  }
};

exports.getMovimientos = async (req, res) => {
  try {
    // Normaliza filtros
    const envase_tipo_id = req.query.envase_tipo_id ? Number(req.query.envase_tipo_id) : undefined;
    const lote_id = req.query.lote_id ? Number(req.query.lote_id) : undefined;
    const tipo = req.query.tipo ? String(req.query.tipo).toUpperCase() : undefined;
    const limit = Number(req.query.limit ?? 100);
    const offset = Number(req.query.offset ?? 0);

    const where = {};
    if (envase_tipo_id) where.envase_tipo_id = envase_tipo_id;
    if (lote_id) where.lote_id = lote_id;
    if (tipo) where.tipo = tipo;

    const data = await MovimientoEnvase.findAll({
      where,
      include: [{ model: EnvaseTipo }, { model: Lote }],
      order: [['movimiento_id', 'DESC']],
      limit,
      offset
    });

    return res.json({ ok: true, data });
  } catch (error) {
    console.error('Error getMovimientos:', error?.message, error?.original?.message || '');
    return res.status(500).json({
      ok: false,
      error: 'Error interno del servidor',
      detail: error?.original?.message || error?.message
    });
  }
};

exports.getSaldo = async (req, res) => {
  try {
    const envase_tipo_id = req.query.envase_tipo_id ? Number(req.query.envase_tipo_id) : null;
    const lote_id = req.query.lote_id ? Number(req.query.lote_id) : null;

    if (!envase_tipo_id) {
      return res.status(400).json({ ok: false, error: 'envase_tipo_id es requerido' });
    }

    const saldo = await obtenerStock({ envase_tipo_id, lote_id });
    return res.json({ ok: true, envase_tipo_id, lote_id, saldo });
  } catch (error) {
    console.error('Error getSaldo:', error?.message, error?.original?.message || '');
    return res.status(500).json({
      ok: false,
      error: 'Error interno del servidor',
      detail: error?.original?.message || error?.message
    });
  }
};

exports.deleteMovimiento = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const mov = await MovimientoEnvase.findByPk(id);
    if (!mov) return res.status(404).json({ ok: false, error: 'Movimiento no encontrado' });

    await mov.destroy();
    return res.json({ ok: true, message: 'Movimiento eliminado' });
  } catch (error) {
    console.error('Error deleteMovimiento:', error?.message, error?.original?.message || '');
    return res.status(500).json({
      ok: false,
      error: 'Error interno del servidor',
      detail: error?.original?.message || error?.message
    });
  }
};
