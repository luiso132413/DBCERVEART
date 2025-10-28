// APP/Controllers/controller.inventarioEnvases.js
const { InventarioEnvase, EnvaseTipo } = require('../models/models.index');

function byPkOr(whereField, value) {
  // Soporta PK real o búsqueda por campo único id_envase_tipo
  if (InventarioEnvase.primaryKeyAttributes?.includes('id_envase_tipo')) {
    return InventarioEnvase.findByPk(value, {
      include: [{ model: EnvaseTipo, as: 'envaseTipo', required: false }],
    });
  }
  return InventarioEnvase.findOne({
    where: { [whereField]: value },
    include: [{ model: EnvaseTipo, as: 'envaseTipo', required: false }],
  });
}

module.exports = {
  // GET /inventario-envases
  async list(_req, res) {
    try {
      const rows = await InventarioEnvase.findAll({
        include: [{ model: EnvaseTipo, as: 'envaseTipo', required: false }],
        order: [[InventarioEnvase.primaryKeyAttribute || 'id_envase_tipo', 'ASC']],
      });
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  // GET /inventario-envases/:id_envase_tipo
  async get(req, res) {
    try {
      const { id_envase_tipo } = req.params;
      const it = await byPkOr('id_envase_tipo', id_envase_tipo);
      if (!it) return res.status(404).json({ error: 'No encontrado' });
      res.json(it);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  // POST /inventario-envases
  // Crea si no existe; si existe, SET absoluto de cantidad.
  async createOrSet(req, res) {
    try {
      let { id_envase_tipo, cantidad } = req.body;
      if (id_envase_tipo == null || cantidad == null) {
        return res.status(400).json({ error: 'id_envase_tipo y cantidad son requeridos' });
      }
      cantidad = Number(cantidad);
      if (Number.isNaN(cantidad) || cantidad < 0) {
        return res.status(400).json({ error: 'cantidad debe ser un número >= 0' });
      }

      let row = await InventarioEnvase.findOne({ where: { id_envase_tipo } });
      if (!row) {
        row = await InventarioEnvase.create({ id_envase_tipo, cantidad });
        const withInc = await byPkOr('id_envase_tipo', id_envase_tipo);
        return res.status(201).json(withInc);
      } else {
        row.cantidad = cantidad; // set absoluto
        await row.save();
        const withInc = await byPkOr('id_envase_tipo', id_envase_tipo);
        return res.json(withInc);
      }
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Registro duplicado' });
      }
      res.status(500).json({ error: e.message });
    }
  },

  // PATCH /inventario-envases/:id_envase_tipo
  // Acepta { delta } (sumar/restar) o { cantidad } (set absoluto).
  async updateQty(req, res) {
    try {
      const { id_envase_tipo } = req.params;
      const { delta, cantidad } = req.body;

      const row = await InventarioEnvase.findOne({ where: { id_envase_tipo } });
      if (!row) return res.status(404).json({ error: 'Inventario no encontrado' });

      if (cantidad != null) {
        const val = Number(cantidad);
        if (Number.isNaN(val) || val < 0) return res.status(400).json({ error: 'cantidad debe ser >= 0' });
        row.cantidad = val;
      } else if (delta != null) {
        const d = Number(delta);
        if (Number.isNaN(d)) return res.status(400).json({ error: 'delta debe ser numérico' });
        const nueva = Number(row.cantidad) + d;
        if (nueva < 0) return res.status(400).json({ error: 'La cantidad resultante no puede ser negativa' });
        row.cantidad = nueva;
      } else {
        return res.status(400).json({ error: 'Debes enviar { delta } o { cantidad }' });
      }

      await row.save();
      const withInc = await byPkOr('id_envase_tipo', id_envase_tipo);
      res.json(withInc);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  // (Opcional, por si lo usas luego)
  async remove(req, res) {
    try {
      const { id_envase_tipo } = req.params;
      const where = { id_envase_tipo };
      const rows = await InventarioEnvase.destroy({ where });
      if (!rows) return res.status(404).json({ error: 'No encontrado' });
      res.status(204).send();
    } catch (e) { res.status(500).json({ error: e.message }); }
  },
};
