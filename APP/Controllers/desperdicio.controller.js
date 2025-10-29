const { Desperdicio, CausaDesperdicio, Lote } = require('../config/db.config');
const { validationResult } = require('express-validator');

exports.createDesperdicio = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { fecha, lote_id, causa_id, cantidad_litros, notas } = req.body;

    const lote = await Lote.findByPk(lote_id);
    if (!lote) return res.status(400).json({ error: 'Lote inválido' });

    const causa = await CausaDesperdicio.findByPk(causa_id);
    if (!causa) return res.status(400).json({ error: 'Causa inválida' });

    const desp = await Desperdicio.create({
      fecha: fecha || new Date(),
      lote_id,
      causa_id,
      cantidad_litros,
      notas
    });

    res.status(201).json({ message: 'Desperdicio registrado', desperdicio: desp });
  } catch (error) {
    console.error('Error createDesperdicio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getDesperdicios = async (_req, res) => {
  try {
    const data = await Desperdicio.findAll({
      include: [{ model: CausaDesperdicio }, { model: Lote }],
      order: [['desperdicio_id', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    console.error('Error getDesperdicios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteDesperdicio = async (req, res) => {
  try {
    const d = await Desperdicio.findByPk(req.params.id);
    if (!d) return res.status(404).json({ error: 'Registro no encontrado' });

    await d.destroy();
    res.json({ message: 'Desperdicio eliminado' });
  } catch (error) {
    console.error('Error deleteDesperdicio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
