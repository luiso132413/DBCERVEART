// controllers/lotes.controller.js
const { Lote, Estilo } = require('../models/models.index');

exports.list = async (req, res) => {
  try {
    const where = {};
    if (req.query.estado) where.estado = req.query.estado;
    const rows = await Lote.findAll({
      where,
      include: [{ model: Estilo, attributes: ['nombre_estilo'] }],
      order: [['fecha_inicio_lote','DESC'], ['id_lote','DESC']]
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.get = async (req, res) => {
  try {
    const it = await Lote.findByPk(req.params.id, {
      include: [{ model: Estilo, attributes: ['nombre_estilo'] }]
    });
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    res.json(it);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const it = await Lote.create(req.body);
    res.status(201).json({ id_lote: it.id_lote });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'codigo_lote duplicado' });
    res.status(500).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const it = await Lote.findByPk(req.params.id);
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    Object.assign(it, req.body);
    await it.save();
    res.json({ id_lote: it.id_lote, updated: true });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'codigo_lote duplicado' });
    res.status(500).json({ error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const rows = await Lote.destroy({ where: { id_lote: req.params.id } });
    if (!rows) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
};
