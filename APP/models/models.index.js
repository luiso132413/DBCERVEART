// APP/models/models.index.js
const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize');

// Importa las factorías EXACTAMENTE con estos nombres de archivo.
// Si tus archivos se llaman distinto, ajusta los require.
const Estilo         = require('./models.Estilo')(sequelize, DataTypes);
const Insumo         = require('./models.Insumo')(sequelize, DataTypes);
const Producto       = require('./models.Producto')(sequelize, DataTypes);
const Receta         = require('./models.Receta')(sequelize, DataTypes);
const RecetaDetalle  = require('./models.RecetaDetalle')(sequelize, DataTypes);
const Lote           = require('./models.Lote')(sequelize, DataTypes);
const Envasado       = require('./models.Envasado')(sequelize, DataTypes);
const Cliente        = require('./models.Cliente')(sequelize, DataTypes);
const Venta          = require('./models.Venta')(sequelize, DataTypes);
const VentaDetalle   = require('./models.VentaDetalle')(sequelize, DataTypes);
const Desperdicio    = require('./models.Desperdicio')(sequelize, DataTypes);

/* ======================
   Asociaciones (FK/PK)
   ====================== */

// Estilo ↔ Producto (1:N)
Producto.belongsTo(Estilo, { foreignKey: 'id_estilo', as: 'estilo' });
Estilo.hasMany(Producto,   { foreignKey: 'id_estilo', as: 'productos' });

// Estilo ↔ Receta (1:N)
Receta.belongsTo(Estilo, { foreignKey: 'id_estilo', as: 'estilo' });
Estilo.hasMany(Receta,   { foreignKey: 'id_estilo', as: 'recetas' });

// Receta ↔ RecetaDetalle (1:N) e Insumo ↔ RecetaDetalle (1:N)
RecetaDetalle.belongsTo(Receta, { foreignKey: 'id_receta', as: 'receta' });
Receta.hasMany(RecetaDetalle,   { foreignKey: 'id_receta', as: 'detalles' });

RecetaDetalle.belongsTo(Insumo, { foreignKey: 'id_insumo', as: 'insumo' });
Insumo.hasMany(RecetaDetalle,   { foreignKey: 'id_insumo', as: 'recetas' });

// Receta ↔ Lote (1:N)
Lote.belongsTo(Receta, { foreignKey: 'id_receta', as: 'receta' });
Receta.hasMany(Lote,   { foreignKey: 'id_receta', as: 'lotes' });

// Lote ↔ Envasado (1:N) y Producto ↔ Envasado (1:N)
Envasado.belongsTo(Lote,     { foreignKey: 'id_lote', as: 'lote' });
Lote.hasMany(Envasado,       { foreignKey: 'id_lote', as: 'envasados' });

Envasado.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });
Producto.hasMany(Envasado,   { foreignKey: 'id_producto', as: 'envasados' });

// Cliente ↔ Venta (1:N)
Venta.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });
Cliente.hasMany(Venta,   { foreignKey: 'id_cliente', as: 'ventas' });

// Venta ↔ VentaDetalle (1:N) y Producto ↔ VentaDetalle (1:N)
VentaDetalle.belongsTo(Venta,    { foreignKey: 'id_venta', as: 'venta' });
Venta.hasMany(VentaDetalle,      { foreignKey: 'id_venta', as: 'detalles' });

VentaDetalle.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });
Producto.hasMany(VentaDetalle,   { foreignKey: 'id_producto', as: 'venta_detalles' });

// Desperdicio (opcional hacia Insumo o Producto, según 'tipo')
Desperdicio.belongsTo(Insumo,   { foreignKey: 'id_insumo',   as: 'insumo',   constraints: false });
Insumo.hasMany(Desperdicio,     { foreignKey: 'id_insumo',   as: 'desperdicios_insumo', constraints: false });

Desperdicio.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto', constraints: false });
Producto.hasMany(Desperdicio,   { foreignKey: 'id_producto', as: 'desperdicios_producto', constraints: false });

module.exports = {
  sequelize,
  Estilo,
  Insumo,
  Producto,
  Receta,
  RecetaDetalle,
  Lote,
  Envasado,
  Cliente,
  Venta,
  VentaDetalle,
  Desperdicio
};
