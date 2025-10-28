const { Estilo } = require('../config/db');
const { validationResult } = require('express-validator');

exports.createEstilo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { nombre, abv, notas } = req.body;

    const exists = await Estilo.findOne({ where: { nombre } });
    if (exists) return res.status(409).json({ error: 'El estilo ya existe' });

    const estilo = await Estilo.create({ nombre, abv, notas });
    res.status(201).json({ message: 'Estilo creado', estilo });
  } catch (error) {
    console.error('Error createEstilo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getEstilos = async (_req, res) => {
  try {
    const estilos = await Estilo.findAll({ order: [['estilo_id', 'ASC']] });
    res.json(estilos);
  } catch (error) {
    console.error('Error getEstilos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getEstiloById = async (req, res) => {
  try {
    const estilo = await Estilo.findByPk(req.params.id);
    if (!estilo) return res.status(404).json({ error: 'Estilo no encontrado' });
    res.json(estilo);
  } catch (error) {
    console.error('Error getEstiloById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateEstilo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const estilo = await Estilo.findByPk(req.params.id);
    if (!estilo) return res.status(404).json({ error: 'Estilo no encontrado' });

    const { nombre, abv, notas } = req.body;
    if (nombre && nombre !== estilo.nombre) {
      const dup = await Estilo.findOne({ where: { nombre } });
      if (dup) return res.status(409).json({ error: 'Ya existe un estilo con ese nombre' });
    }

    await estilo.update({ nombre, abv, notas });
    res.json({ message: 'Estilo actualizado', estilo });
  } catch (error) {
    console.error('Error updateEstilo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteEstilo = async (req, res) => {
  try {
    const estilo = await Estilo.findByPk(req.params.id);
    if (!estilo) return res.status(404).json({ error: 'Estilo no encontrado' });

    await estilo.destroy();
    res.json({ message: 'Estilo eliminado' });
  } catch (error) {
    console.error('Error deleteEstilo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
