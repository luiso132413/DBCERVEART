const { CausaDesperdicio } = require('../config/db');
const { validationResult } = require('express-validator');

exports.createCausa = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { nombre } = req.body;
    const dup = await CausaDesperdicio.findOne({ where: { nombre } });
    if (dup) return res.status(409).json({ error: 'La causa ya existe' });

    const causa = await CausaDesperdicio.create({ nombre });
    res.status(201).json({ message: 'Causa creada', causa });
  } catch (error) {
    console.error('Error createCausa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getCausas = async (_req, res) => {
  try {
    const causas = await CausaDesperdicio.findAll({ order: [['causa_id', 'ASC']] });
    res.json(causas);
  } catch (error) {
    console.error('Error getCausas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateCausa = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const causa = await CausaDesperdicio.findByPk(req.params.id);
    if (!causa) return res.status(404).json({ error: 'Causa no encontrada' });

    const { nombre } = req.body;
    if (nombre && nombre !== causa.nombre) {
      const dup = await CausaDesperdicio.findOne({ where: { nombre } });
      if (dup) return res.status(409).json({ error: 'Ya existe una causa con ese nombre' });
    }

    await causa.update({ nombre });
    res.json({ message: 'Causa actualizada', causa });
  } catch (error) {
    console.error('Error updateCausa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteCausa = async (req, res) => {
  try {
    const causa = await CausaDesperdicio.findByPk(req.params.id);
    if (!causa) return res.status(404).json({ error: 'Causa no encontrada' });

    await causa.destroy();
    res.json({ message: 'Causa eliminada' });
  } catch (error) {
    console.error('Error deleteCausa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
