// controllers/inventarioEnvases.controller.js
const { InventarioEnvase, EnvaseTipo } = require('../models/models.index');

exports.list = async (_req, res) => {
  try {
    const rows = await InventarioEnvase.findAll({
      include: [{ model: EnvaseTipo, attributes: ['nombre_tipo','capacidad_litros'] }],
      order: [[EnvaseTipo, 'nombre_tipo', 'ASC'], [EnvaseTipo, 'capacidad_litros', 'ASC']]
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.get = async (req, res) => {
  try {
    const it = await InventarioEnvase.findByPk(req.params.id_envase_tipo, {
      include: [{ model: EnvaseTipo, attributes: ['nombre_tipo','capacidad_litros'] }]
    });
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    res.json(it);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// Crea si no existe o establece cantidad exacta (upsert)
exports.createOrSet = async (req, res) => {
  try {
    const { id_envase_tipo, cantidad_envase } = req.body;
    await InventarioEnvase.upsert({ id_envase_tipo, cantidad_envase });
    const it = await InventarioEnvase.findByPk(id_envase_tipo, {
      include: [{ model: EnvaseTipo, attributes: ['nombre_tipo','capacidad_litros'] }]
    });
    res.status(201).json(it);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.updateQty = async (req, res) => {
  try {
    const { cantidad_envase } = req.body;
    const [rows] = await InventarioEnvase.update(
      { cantidad_envase },
      { where: { id_envase_tipo: req.params.id_envase_tipo } }
    );
    if (!rows) return res.status(404).json({ error: 'No encontrado' });
    res.json({ id_envase_tipo: Number(req.params.id_envase_tipo), cantidad_envase });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
