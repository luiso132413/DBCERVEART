// controllers/movimientosEnvase.controller.js
const { sequelize, MovimientoEnvase, InventarioEnvase, EnvaseTipo, Lote } = require('../models/models.index');

exports.list = async (_req, res) => {
  try {
    const rows = await MovimientoEnvase.findAll({
      include: [
        { model: EnvaseTipo, attributes: ['nombre_tipo','capacidad_litros'] },
        { model: Lote, attributes: ['codigo_lote'] }
      ],
      order: [['fecha', 'DESC'], ['id_mov','DESC']]
    });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.get = async (req, res) => {
  try {
    const it = await MovimientoEnvase.findByPk(req.params.id, {
      include: [
        { model: EnvaseTipo, attributes: ['nombre_tipo','capacidad_litros'] },
        { model: Lote, attributes: ['codigo_lote'] }
      ]
    });
    if (!it) return res.status(404).json({ error: 'No encontrado' });
    res.json(it);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.create = async (req, res) => {
  const { id_envase_tipo, tipo_mov, cantidad, id_lote, nota, fecha } = req.body;

  if (!id_envase_tipo || !tipo_mov || !cantidad)
    return res.status(400).json({ error: 'id_envase_tipo, tipo_mov y cantidad son requeridos' });

  if (!['ENTRADA','SALIDA'].includes(tipo_mov))
    return res.status(400).json({ error: 'tipo_mov inválido' });

  const t = await sequelize.transaction();
  try {
    // 1) Insert movimiento
    const mov = await MovimientoEnvase.create(
      { id_envase_tipo, tipo_mov, cantidad, id_lote: id_lote ?? null, nota, fecha },
      { transaction: t }
    );

    // 2) Garantizar fila de inventario
    const [inv] = await InventarioEnvase.findOrCreate({
      where: { id_envase_tipo },
      defaults: { cantidad_envase: 0 },
      transaction: t
    });

    // 3) Actualizar stock con validación
    const qty = Number(cantidad);
    if (tipo_mov === 'ENTRADA') {
      inv.cantidad_envase = Number(inv.cantidad_envase) + qty;
    } else {
      if (Number(inv.cantidad_envase) < qty)
        throw new Error(`Stock insuficiente: disponible=${inv.cantidad_envase}, solicitado=${qty}`);
      inv.cantidad_envase = Number(inv.cantidad_envase) - qty;
    }
    await inv.save({ transaction: t });

    await t.commit();
    res.status(201).json({ id_mov: mov.id_mov, inventario: inv });
  } catch (e) {
    await t.rollback();
    res.status(400).json({ error: e.message });
  }
};
