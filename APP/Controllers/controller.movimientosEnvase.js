// APP/Controllers/controller.movimientosEnvase.js
const { MovimientoEnvase, EnvaseTipo, Lote } = require('../models/models.index');

// ==================== LISTAR ====================
exports.list = async (_req, res) => {
  try {
    const rows = await MovimientoEnvase.findAll({
      include: [
        { model: EnvaseTipo, as: 'tipo', attributes: ['id_envase_tipo','nombre_tipo','capacidad_litros'] },
        { model: Lote,       as: 'lote', attributes: ['id_lote','codigo_lote'] }
      ],
      order: [['fecha','DESC'], ['id_mov','DESC']]
    });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ==================== OBTENER UNO ====================
exports.get = async (req, res) => {
  try {
    const it = await MovimientoEnvase.findByPk(req.params.id, {
      include: [
        { model: EnvaseTipo, as: 'tipo', attributes: ['id_envase_tipo','nombre_tipo','capacidad_litros'] },
        { model: Lote,       as: 'lote', attributes: ['id_lote','codigo_lote'] }
      ]
    });
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    res.json(it);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ==================== CREAR ====================
exports.create = async (req, res) => {
  try {
    const { id_envase_tipo, fecha, tipo_mov, cantidad, id_lote, nota } = req.body;
    const it = await MovimientoEnvase.create({
      id_envase_tipo,
      fecha,
      tipo_mov,
      cantidad,
      id_lote: id_lote || null,
      nota: nota || null
    });
    res.status(201).json({ id_mov: it.id_mov });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
