// controllers/causasDesperdicio.controller.js
const { CausaDesperdicio } = require('../models/models.index');

exports.list = async (_req, res) => {
  try {
    const rows = await CausaDesperdicio.findAll({ order: [['nombre_desperdicio','ASC']] });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.get = async (req, res) => {
  try {
    const it = await CausaDesperdicio.findByPk(req.params.id);
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    res.json(it);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const it = await CausaDesperdicio.create(req.body);
    res.status(201).json(it);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'Causa duplicada' });
    res.status(500).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const it = await CausaDesperdicio.findByPk(req.params.id);
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    Object.assign(it, req.body);
    await it.save();
    res.json(it);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'Causa duplicada' });
    res.status(500).json({ error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const rows = await CausaDesperdicio.destroy({ where: { id_causa: req.params.id } });
    if (!rows) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
};
