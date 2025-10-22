// controllers/lotes.controller.js
const { Lote, Estilo } = require('../models/models.index');

const includeEstilo = {
  model: Estilo,
  as: 'estilo', // 👈 alias EXACTO
  attributes: ['id_estilo', 'nombre_estilo']
};

// Helper para aplanar la respuesta
const flat = (l) => ({
  id_lote: l.id_lote,
  codigo_lote: l.codigo_lote,
  fecha_inicio_lote: l.fecha_inicio_lote,
  fecha_fin_lote: l.fecha_fin_lote,
  litros_producidos: l.litros_producidos,
  estado: l.estado,
  id_estilo: l.id_estilo,
  nombre_estilo: l.estilo?.nombre_estilo ?? null
});

exports.list = async (req, res) => {
  try {
    const where = {};
    if (req.query.estado) where.estado = req.query.estado;

    const rows = await Lote.findAll({
      where,
      include: [includeEstilo],
      order: [
        ['fecha_inicio_lote', 'DESC'],
        ['id_lote', 'DESC'],
        [{ model: Estilo, as: 'estilo' }, 'nombre_estilo', 'ASC'] // 👈 si ordenas por asociada, usa alias
      ]
    });

    res.json(rows.map(flat));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.get = async (req, res) => {
  try {
    const it = await Lote.findByPk(req.params.id, { include: [includeEstilo] });
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    res.json(flat(it));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const it = await Lote.create(req.body);
    const r = await Lote.findByPk(it.id_lote, { include: [includeEstilo] });
    res.status(201).json(flat(r));
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'codigo_lote duplicado' });
    }
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const it = await Lote.findByPk(req.params.id);
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    Object.assign(it, req.body);
    await it.save();
    const r = await Lote.findByPk(req.params.id, { include: [includeEstilo] });
    res.json(flat(r));
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'codigo_lote duplicado' });
    }
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const rows = await Lote.destroy({ where: { id_lote: req.params.id } });
    if (!rows) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
