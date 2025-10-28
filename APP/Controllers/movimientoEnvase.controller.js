const { MovimientoEnvase, EnvaseTipo, Lote, Sequelize } = require('../config/db');
const { validationResult } = require('express-validator');
const { Op, fn, col, literal } = Sequelize;

// Helper: stock por EnvaseTipo (y opcional Lote)
async function obtenerStock({ envase_tipo_id, lote_id = null }) {
  const where = { envase_tipo_id };
  if (lote_id) where.lote_id = lote_id;

  const rows = await MovimientoEnvase.findAll({
    where,
    attributes: [
      [fn('SUM', literal(`CASE WHEN tipo='ENTRADA' THEN cantidad
                              WHEN tipo='AJUSTE' THEN cantidad
                              WHEN tipo='SALIDA' THEN -cantidad
                              ELSE 0 END`)), 'saldo']
    ]
  });

  const saldo = parseInt(rows?.[0]?.get('saldo') || 0, 10);
  return isNaN(saldo) ? 0 : saldo;
}

exports.createMovimiento = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { fecha, tipo, envase_tipo_id, lote_id, cantidad, detalle } = req.body;

    if (!['ENTRADA', 'SALIDA', 'AJUSTE'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo inválido' });
    }

    const envase = await EnvaseTipo.findByPk(envase_tipo_id);
    if (!envase) return res.status(400).json({ error: 'EnvaseTipo inválido' });

    if (lote_id) {
      const lote = await Lote.findByPk(lote_id);
      if (!lote) return res.status(400).json({ error: 'Lote inválido' });
    }

    if (tipo === 'SALIDA') {
      // Verifica stock suficiente (por envase; si mandas lote_id se valida por lote+envase)
      const stockActual = await obtenerStock({ envase_tipo_id, lote_id });
      if (stockActual < cantidad) {
        return res.status(400).json({ error: `Stock insuficiente. Disponible: ${stockActual}` });
      }
    }

    // Para AJUSTE puedes mandar cantidad positiva o negativa; aquí lo guardamos tal cual
    const mov = await MovimientoEnvase.create({
      fecha: fecha || new Date(),
      tipo,
      envase_tipo_id,
      lote_id: lote_id || null,
      cantidad,
      detalle
    });

    const saldo = await obtenerStock({ envase_tipo_id, lote_id });
    res.status(201).json({
      message: 'Movimiento registrado',
      movimiento: mov,
      saldo_actual: saldo,
      scope: { envase_tipo_id, lote_id: lote_id || null }
    });
  } catch (error) {
    console.error('Error createMovimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getMovimientos = async (req, res) => {
  try {
    const { envase_tipo_id, lote_id, tipo, limit = 100, offset = 0 } = req.query;

    const where = {};
    if (envase_tipo_id) where.envase_tipo_id = envase_tipo_id;
    if (lote_id) where.lote_id = lote_id;
    if (tipo) where.tipo = tipo;

    const data = await MovimientoEnvase.findAll({
      where,
      include: [{ model: EnvaseTipo }, { model: Lote }],
      order: [['movimiento_id', 'DESC']],
      limit: Number(limit),
      offset: Number(offset)
    });

    res.json(data);
  } catch (error) {
    console.error('Error getMovimientos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getSaldo = async (req, res) => {
  try {
    const { envase_tipo_id, lote_id } = req.query;
    if (!envase_tipo_id) return res.status(400).json({ error: 'envase_tipo_id es requerido' });

    const saldo = await obtenerStock({ envase_tipo_id, lote_id: lote_id || null });
    res.json({ envase_tipo_id, lote_id: lote_id || null, saldo });
  } catch (error) {
    console.error('Error getSaldo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteMovimiento = async (req, res) => {
  try {
    const mov = await MovimientoEnvase.findByPk(req.params.id);
    if (!mov) return res.status(404).json({ error: 'Movimiento no encontrado' });

    await mov.destroy();
    res.json({ message: 'Movimiento eliminado' });
  } catch (error) {
    console.error('Error deleteMovimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
