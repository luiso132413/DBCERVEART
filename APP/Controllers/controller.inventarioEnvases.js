// controllers/inventarioEnvases.controller.js
const { InventarioEnvase, EnvaseTipo } = require('../models/models.index');

const includeTipo = {
  model: EnvaseTipo,
  as: 'tipo', // 👈 alias definido en los modelos
  attributes: ['id_envase_tipo', 'nombre_tipo', 'capacidad_litros']
};

exports.list = async (_req, res) => {
  try {
    const rows = await InventarioEnvase.findAll({
      include: [includeTipo],
      order: [
        [{ model: EnvaseTipo, as: 'tipo' }, 'nombre_tipo', 'ASC'],
        [{ model: EnvaseTipo, as: 'tipo' }, 'capacidad_litros', 'ASC']
      ]
    });

    // Flatten para el frontend
    const data = rows.map(r => ({
      id_envase_tipo: r.id_envase_tipo,
      cantidad_envase: r.cantidad_envase,
      nombre_tipo: r.tipo?.nombre_tipo,
      capacidad_litros: r.tipo?.capacidad_litros
    }));

    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.get = async (req, res) => {
  try {
    const r = await InventarioEnvase.findByPk(req.params.id_envase_tipo, {
      include: [includeTipo]
    });
    if (!r) return res.status(404).json({ error: 'No encontrado' });

    // Flatten
    res.json({
      id_envase_tipo: r.id_envase_tipo,
      cantidad_envase: r.cantidad_envase,
      nombre_tipo: r.tipo?.nombre_tipo,
      capacidad_litros: r.tipo?.capacidad_litros
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

// Crea si no existe o establece cantidad exacta (upsert)
exports.createOrSet = async (req, res) => {
  try {
    const { id_envase_tipo, cantidad_envase } = req.body;
    await InventarioEnvase.upsert({ id_envase_tipo, cantidad_envase });

    const r = await InventarioEnvase.findByPk(id_envase_tipo, {
      include: [includeTipo]
    });

    res.status(201).json({
      id_envase_tipo: r.id_envase_tipo,
      cantidad_envase: r.cantidad_envase,
      nombre_tipo: r.tipo?.nombre_tipo,
      capacidad_litros: r.tipo?.capacidad_litros
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.updateQty = async (req, res) => {
  try {
    const { cantidad_envase } = req.body;
    const [rows] = await InventarioEnvase.update(
      { cantidad_envase },
      { where: { id_envase_tipo: req.params.id_envase_tipo } }
    );
    if (!rows) return res.status(404).json({ error: 'No encontrado' });

    // Devuelve shape consistente con list/get
    const r = await InventarioEnvase.findByPk(req.params.id_envase_tipo, {
      include: [includeTipo]
    });

    res.json({
      id_envase_tipo: r.id_envase_tipo,
      cantidad_envase: r.cantidad_envase,
      nombre_tipo: r.tipo?.nombre_tipo,
      capacidad_litros: r.tipo?.capacidad_litros
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
