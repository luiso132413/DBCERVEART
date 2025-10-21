// controllers/desperdicios.controller.js
const { Desperdicio, CausaDesperdicio, Lote } = require('../models/models.index');

exports.list = async (req, res) => {
  try {
    const where = {};
    if (req.query.id_lote) where.id_lote = req.query.id_lote;

    const rows = await Desperdicio.findAll({
      where,
      include: [
        { model: CausaDesperdicio, attributes: ['nombre_desperdicio'] },
        { model: Lote, attributes: ['codigo_lote'] }
      ],
      order: [['fecha','DESC'], ['id_desp','DESC']]
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.get = async (req, res) => {
  try {
    const it = await Desperdicio.findByPk(req.params.id, {
      include: [
        { model: CausaDesperdicio, attributes: ['nombre_desperdicio'] },
        { model: Lote, attributes: ['codigo_lote'] }
      ]
    });
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    res.json(it);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const it = await Desperdicio.create(req.body);
    res.status(201).json({ id_desp: it.id_desp });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const it = await Desperdicio.findByPk(req.params.id);
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    Object.assign(it, req.body);
    await it.save();
    res.json({ id_desp: it.id_desp, updated: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.remove = async (req, res) => {
  try {
    const rows = await Desperdicio.destroy({ where: { id_desp: req.params.id } });
    if (!rows) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (e) { res.status(500).json({ error: e.message }); }
};
