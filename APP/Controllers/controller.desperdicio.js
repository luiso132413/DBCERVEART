// controllers/desperdicio.controller.js
const { Desperdicio } = require('../models/models.index');

exports.list = async (_req, res) => {
  try {
    const rows = await Desperdicio.findAll({ order: [[Desperdicio.primaryKeyAttribute, 'ASC']] });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.get = async (req, res) => {
  try {
    const it = await Desperdicio.findByPk(req.params.id);
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    res.json(it);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const it = await Desperdicio.create(req.body);
    res.status(201).json(it);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'Registro duplicado' });
    res.status(500).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const it = await Desperdicio.findByPk(req.params.id);
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    Object.assign(it, req.body);
    await it.save();
    res.json(it);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'Registro duplicado' });
    res.status(500).json({ error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const where = { [Desperdicio.primaryKeyAttribute]: req.params.id };
    const rows = await Desperdicio.destroy({ where });
    if (!rows) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
};
