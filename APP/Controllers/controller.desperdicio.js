// APP/Controllers/controller.desperdicio.js
const { Op } = require('sequelize');
const { Desperdicio, CausaDesperdicio, Lote } = require('../models/models.index');

// En models.index.js:
// Desperdicio.belongsTo(CausaDesperdicio, { foreignKey: 'id_causa', as: 'causa' });
// Desperdicio.belongsTo(Lote,             { foreignKey: 'id_lote',  as: 'lote'  });

const includeCausa = {
  model: CausaDesperdicio,
  as: 'causa',                                      // 👈 alias OBLIGATORIO
  attributes: ['id_causa', 'nombre_desperdicio']
};

const includeLote = {
  model: Lote,
  as: 'lote',                                       // 👈 alias OBLIGATORIO
  attributes: ['id_lote', 'codigo_lote']
};

const flat = d => ({
  id_desp: d.id_desp,
  id_lote: d.id_lote,
  fecha: d.fecha,
  litros: d.litros,
  id_causa: d.id_causa,
  comentario: d.comentario ?? null,
  codigo_lote: d.lote?.codigo_lote ?? null,
  nombre_desperdicio: d.causa?.nombre_desperdicio ?? null
});

exports.list = async (req, res) => {
  try {
    const where = {};
    if (req.query.id_lote) where.id_lote = req.query.id_lote;
    if (req.query.desde) where.fecha = { ...(where.fecha || {}), [Op.gte]: new Date(req.query.desde) };
    if (req.query.hasta) where.fecha = { ...(where.fecha || {}), [Op.lte]: new Date(req.query.hasta) };

    const rows = await Desperdicio.findAll({
      where,
      include: [includeCausa, includeLote],
      order: [
        ['fecha', 'DESC'],
        ['id_desp', 'DESC'],
        [{ model: CausaDesperdicio, as: 'causa' }, 'nombre_desperdicio', 'ASC'], // 👈 usa alias también en order
        [{ model: Lote,             as: 'lote'  }, 'codigo_lote',       'ASC']
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
    const d = await Desperdicio.findByPk(req.params.id, { include: [includeCausa, includeLote] });
    if (!d) return res.status(404).json({ error: 'No encontrado' });
    res.json(flat(d));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const d = await Desperdicio.create(req.body);
    const r = await Desperdicio.findByPk(d.id_desp, { include: [includeCausa, includeLote] });
    res.status(201).json(flat(r));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const d = await Desperdicio.findByPk(req.params.id);
    if (!d) return res.status(404).json({ error: 'No encontrado' });
    Object.assign(d, req.body);
    await d.save();
    const r = await Desperdicio.findByPk(req.params.id, { include: [includeCausa, includeLote] });
    res.json(flat(r));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const rows = await Desperdicio.destroy({ where: { id_desp: req.params.id } });
    if (!rows) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
