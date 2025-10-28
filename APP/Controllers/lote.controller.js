const { Lote, Estilo } = require('../config/db');
const { validationResult } = require('express-validator');

exports.createLote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const {
      codigo, estilo_id, fecha_inicio,
      fecha_fin, volumen_producido_litros, estado
    } = req.body;

    const dup = await Lote.findOne({ where: { codigo } });
    if (dup) return res.status(409).json({ error: 'Ya existe un lote con ese código' });

    const estilo = await Estilo.findByPk(estilo_id);
    if (!estilo) return res.status(400).json({ error: 'Estilo inválido' });

    const lote = await Lote.create({
      codigo, estilo_id, fecha_inicio,
      fecha_fin, volumen_producido_litros,
      estado: estado || 'EN_PROCESO'
    });

    res.status(201).json({ message: 'Lote creado', lote });
  } catch (error) {
    console.error('Error createLote:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getLotes = async (_req, res) => {
  try {
    const lotes = await Lote.findAll({
      include: [{ model: Estilo }],
      order: [['lote_id', 'DESC']]
    });
    res.json(lotes);
  } catch (error) {
    console.error('Error getLotes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getLoteById = async (req, res) => {
  try {
    const lote = await Lote.findByPk(req.params.id, { include: [{ model: Estilo }] });
    if (!lote) return res.status(404).json({ error: 'Lote no encontrado' });
    res.json(lote);
  } catch (error) {
    console.error('Error getLoteById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateLote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const lote = await Lote.findByPk(req.params.id);
    if (!lote) return res.status(404).json({ error: 'Lote no encontrado' });

    const {
      codigo, estilo_id, fecha_inicio,
      fecha_fin, volumen_producido_litros, estado
    } = req.body;

    if (codigo && codigo !== lote.codigo) {
      const dup = await Lote.findOne({ where: { codigo } });
      if (dup) return res.status(409).json({ error: 'Código de lote ya en uso' });
    }

    if (estilo_id) {
      const estilo = await Estilo.findByPk(estilo_id);
      if (!estilo) return res.status(400).json({ error: 'Estilo inválido' });
    }

    await lote.update({
      codigo, estilo_id, fecha_inicio,
      fecha_fin, volumen_producido_litros, estado
    });

    res.json({ message: 'Lote actualizado', lote });
  } catch (error) {
    console.error('Error updateLote:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.cambiarEstadoLote = async (req, res) => {
  try {
    const lote = await Lote.findByPk(req.params.id);
    if (!lote) return res.status(404).json({ error: 'Lote no encontrado' });

    const { estado, fecha_fin } = req.body; // EN_PROCESO | COMPLETADO | CANCELADO
    if (!['EN_PROCESO', 'COMPLETADO', 'CANCELADO'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    await lote.update({ estado, fecha_fin: fecha_fin || lote.fecha_fin });
    res.json({ message: 'Estado de lote actualizado', lote });
  } catch (error) {
    console.error('Error cambiarEstadoLote:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteLote = async (req, res) => {
  try {
    const lote = await Lote.findByPk(req.params.id);
    if (!lote) return res.status(404).json({ error: 'Lote no encontrado' });

    await lote.destroy();
    res.json({ message: 'Lote eliminado' });
  } catch (error) {
    console.error('Error deleteLote:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
