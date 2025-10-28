// APP/models/models.index.js
const sequelize = require('../config/db.config');
const { DataTypes } = require('sequelize');

/* ============
   Importación
   ============ */
const Estilo             = require('./models.Estilo')(sequelize, DataTypes);
const EnvaseTipo         = require('./models.EnvaseTipo')(sequelize, DataTypes);
const Lote               = require('./models.Lote')(sequelize, DataTypes);
const InventarioEnvase   = require('./models.InventarioEnvase')(sequelize, DataTypes);
const MovimientoEnvase   = require('./models.MovimientoEnvase')(sequelize, DataTypes);
const CausaDesperdicio   = require('./models.CausaDesperdicio')(sequelize, DataTypes);
const Desperdicio        = require('./models.Desperdicio')(sequelize, DataTypes);

/* ======================
   Asociaciones (FK/PK)
   ====================== */

// Lote ↔ Estilo (N:1)
// SQL: FK_Lote_Estilo ON UPDATE NO ACTION ON DELETE NO ACTION
Lote.belongsTo(Estilo, { foreignKey: 'id_estilo', as: 'estilo', onDelete: 'RESTRICT', onUpdate: 'RESTRICT' });
Estilo.hasMany(Lote,   { foreignKey: 'id_estilo', as: 'lotes',   onDelete: 'RESTRICT', onUpdate: 'RESTRICT' });

// EnvaseTipo ↔ InventarioEnvase (1:1 por UQ id_envase_tipo)
// SQL: UQ_Inv_unico_por_envase; FK_Inv_EnvaseTipo NO ACTION/NO ACTION
InventarioEnvase.belongsTo(EnvaseTipo, { foreignKey: 'id_envase_tipo', as: 'envaseTipo', onDelete: 'RESTRICT', onUpdate: 'RESTRICT' });
EnvaseTipo.hasOne(InventarioEnvase,    { foreignKey: 'id_envase_tipo', as: 'inventario', onDelete: 'RESTRICT', onUpdate: 'RESTRICT' });

// MovimientoEnvase ↔ EnvaseTipo (N:1)
// SQL: FK_Mov_EnvaseTipo NO ACTION/NO ACTION
MovimientoEnvase.belongsTo(EnvaseTipo, { foreignKey: 'id_envase_tipo', as: 'envaseTipo', onDelete: 'RESTRICT', onUpdate: 'RESTRICT' });
EnvaseTipo.hasMany(MovimientoEnvase,   { foreignKey: 'id_envase_tipo', as: 'movimientos', onDelete: 'RESTRICT', onUpdate: 'RESTRICT' });

// MovimientoEnvase ↔ Lote (N:1, opcional)
// SQL: FK_Mov_Lote ON DELETE SET NULL ON UPDATE NO ACTION
MovimientoEnvase.belongsTo(Lote, { foreignKey: 'id_lote', as: 'lote', onDelete: 'SET NULL', onUpdate: 'RESTRICT' });
Lote.hasMany(MovimientoEnvase,   { foreignKey: 'id_lote', as: 'movimientos', onDelete: 'SET NULL', onUpdate: 'RESTRICT' });

// Desperdicio ↔ Lote (N:1)
// SQL: FK_Desp_Lote ON DELETE CASCADE ON UPDATE NO ACTION
Desperdicio.belongsTo(Lote, { foreignKey: 'id_lote', as: 'lote', onDelete: 'CASCADE', onUpdate: 'RESTRICT' });
Lote.hasMany(Desperdicio,   { foreignKey: 'id_lote', as: 'desperdicios', onDelete: 'CASCADE', onUpdate: 'RESTRICT' });

// Desperdicio ↔ CausaDesperdicio (N:1)
// SQL: FK_Desp_Causa NO ACTION/NO ACTION
Desperdicio.belongsTo(CausaDesperdicio, { foreignKey: 'id_causa_desperdicio', as: 'causa', onDelete: 'RESTRICT', onUpdate: 'RESTRICT' });
CausaDesperdicio.hasMany(Desperdicio,    { foreignKey: 'id_causa_desperdicio', as: 'desperdicios', onDelete: 'RESTRICT', onUpdate: 'RESTRICT' });

// Desperdicio ↔ EnvaseTipo (N:1, opcional)
// SQL: FK_Desp_EnvaseTipo ON DELETE SET NULL ON UPDATE NO ACTION
Desperdicio.belongsTo(EnvaseTipo, { foreignKey: 'id_envase_tipo', as: 'envaseTipo', onDelete: 'SET NULL', onUpdate: 'RESTRICT' });
EnvaseTipo.hasMany(Desperdicio,   { foreignKey: 'id_envase_tipo', as: 'desperdicios', onDelete: 'SET NULL', onUpdate: 'RESTRICT' });

/* ============
   Exportación
   ============ */
module.exports = {
  sequelize,
  Estilo,
  EnvaseTipo,
  Lote,
  InventarioEnvase,
  MovimientoEnvase,
  CausaDesperdicio,
  Desperdicio
};
