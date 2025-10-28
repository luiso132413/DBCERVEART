const { EnvaseTipo } = require('../config/db');
const { validationResult } = require('express-validator');

exports.createEnvaseTipo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { nombre, capacidad_ml } = req.body;

    const exists = await EnvaseTipo.findOne({ where: { nombre } });
    if (exists) return res.status(409).json({ error: 'El tipo de envase ya existe' });

    const envase = await EnvaseTipo.create({ nombre, capacidad_ml });
    res.status(201).json({ message: 'Tipo de envase creado', envase });
  } catch (error) {
    console.error('Error createEnvaseTipo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getEnvasesTipo = async (_req, res) => {
  try {
    const envases = await EnvaseTipo.findAll({ order: [['envase_tipo_id', 'ASC']] });
    res.json(envases);
  } catch (error) {
    console.error('Error getEnvasesTipo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getEnvaseTipoById = async (req, res) => {
  try {
    const envase = await EnvaseTipo.findByPk(req.params.id);
    if (!envase) return res.status(404).json({ error: 'Tipo de envase no encontrado' });
    res.json(envase);
  } catch (error) {
    console.error('Error getEnvaseTipoById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateEnvaseTipo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const envase = await EnvaseTipo.findByPk(req.params.id);
    if (!envase) return res.status(404).json({ error: 'Tipo de envase no encontrado' });

    const { nombre, capacidad_ml } = req.body;
    if (nombre && nombre !== envase.nombre) {
      const dup = await EnvaseTipo.findOne({ where: { nombre } });
      if (dup) return res.status(409).json({ error: 'Ya existe un tipo con ese nombre' });
    }

    await envase.update({ nombre, capacidad_ml });
    res.json({ message: 'Tipo de envase actualizado', envase });
  } catch (error) {
    console.error('Error updateEnvaseTipo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.deleteEnvaseTipo = async (req, res) => {
  try {
    const envase = await EnvaseTipo.findByPk(req.params.id);
    if (!envase) return res.status(404).json({ error: 'Tipo de envase no encontrado' });

    await envase.destroy();
    res.json({ message: 'Tipo de envase eliminado' });
  } catch (error) {
    console.error('Error deleteEnvaseTipo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
