// controllers/movimientoEnvase.controller.js
const { MovimientoEnvase, EnvaseTipo } = require('../models/models.index');

exports.list = async (_req, res) => {
  try {
    const rows = await MovimientoEnvase.findAll({
      include: [{ model: EnvaseTipo, as: 'envaseTipo', required: false }],
      order: [[MovimientoEnvase.primaryKeyAttribute, 'ASC']],
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.get = async (req, res) => {
  try {
    const it = await MovimientoEnvase.findByPk(req.params.id, {
      include: [{ model: EnvaseTipo, as: 'envaseTipo', required: false }],
    });
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    res.json(it);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const it = await MovimientoEnvase.create(req.body);
    const withIncludes = await MovimientoEnvase.findByPk(it[MovimientoEnvase.primaryKeyAttribute], {
      include: [{ model: EnvaseTipo, as: 'envaseTipo', required: false }],
    });
    res.status(201).json(withIncludes);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'Registro duplicado' });
    res.status(500).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const it = await MovimientoEnvase.findByPk(req.params.id);
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    Object.assign(it, req.body);
    await it.save();
    const withIncludes = await MovimientoEnvase.findByPk(it[MovimientoEnvase.primaryKeyAttribute], {
      include: [{ model: EnvaseTipo, as: 'envaseTipo', required: false }],
    });
    res.json(withIncludes);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'Registro duplicado' });
    res.status(500).json({ error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const where = { [MovimientoEnvase.primaryKeyAttribute]: req.params.id };
    const rows = await MovimientoEnvase.destroy({ where });
    if (!rows) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
};
