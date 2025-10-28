// controllers/lote.controller.js
const { Lote, Estilo } = require('../models/models.index');

exports.list = async (_req, res) => {
  try {
    const rows = await Lote.findAll({
      include: [{ model: Estilo, as: 'estilo', required: false }],
      order: [[Lote.primaryKeyAttribute, 'ASC']],
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.get = async (req, res) => {
  try {
    const it = await Lote.findByPk(req.params.id, {
      include: [{ model: Estilo, as: 'estilo', required: false }],
    });
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    res.json(it);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const it = await Lote.create(req.body);
    const withIncludes = await Lote.findByPk(it[Lote.primaryKeyAttribute], {
      include: [{ model: Estilo, as: 'estilo', required: false }],
    });
    res.status(201).json(withIncludes);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'Registro duplicado' });
    res.status(500).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const it = await Lote.findByPk(req.params.id);
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    Object.assign(it, req.body);
    await it.save();
    const withIncludes = await Lote.findByPk(it[Lote.primaryKeyAttribute], {
      include: [{ model: Estilo, as: 'estilo', required: false }],
    });
    res.json(withIncludes);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'Registro duplicado' });
    res.status(500).json({ error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const where = { [Lote.primaryKeyAttribute]: req.params.id };
    const rows = await Lote.destroy({ where });
    if (!rows) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
};
