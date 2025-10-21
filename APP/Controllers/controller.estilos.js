// controllers/estilos.controller.js
const { Estilo } = require('../models/models.index');

exports.list = async (_req, res) => {
  try {
    const rows = await Estilo.findAll({ order: [['nombre_estilo', 'ASC']] });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.get = async (req, res) => {
  try {
    const it = await Estilo.findByPk(req.params.id);
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    res.json(it);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const it = await Estilo.create({ nombre_estilo: req.body.nombre_estilo });
    res.status(201).json(it);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'Estilo duplicado' });
    res.status(500).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const it = await Estilo.findByPk(req.params.id);
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    it.nombre_estilo = req.body.nombre_estilo ?? it.nombre_estilo;
    await it.save();
    res.json(it);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'Estilo duplicado' });
    res.status(500).json({ error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const rows = await Estilo.destroy({ where: { id_estilo: req.params.id } });
    if (!rows) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
};
