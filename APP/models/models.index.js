// APP/models/models.index.js
const sequelize = require('../config/db.config');  // <- instancia creada en db.config.js
const { DataTypes } = require('sequelize');        // <- usa DataTypes, no la clase Sequelize

// Importar modelos (asegúrate que los nombres de archivo existan tal cual)
const Estilo            = require('./models.Estilo')(sequelize, DataTypes);
const EnvaseTipo        = require('./models.EnvaseTipo')(sequelize, DataTypes); // <- corregido 'Evase'
const CausaDesperdicio  = require('./models.CausaDesperdicio')(sequelize, DataTypes);
const Lote              = require('./models.Lote')(sequelize, DataTypes);
const InventarioEnvase  = require('./models.InventarioEnvase')(sequelize, DataTypes);
const MovimientoEnvase  = require('./models.MovimientoEnvase')(sequelize, DataTypes);
const Desperdicio       = require('./models.Desperdicio')(sequelize, DataTypes);

// ----------------------
// Relaciones
// ----------------------

// Lote ↔ Estilo (N:1)
Lote.belongsTo(Estilo, { foreignKey: 'id_estilo', as: 'estilo' });
Estilo.hasMany(Lote,   { foreignKey: 'id_estilo', as: 'lotes' });

// InventarioEnvase ↔ EnvaseTipo (¿1:N o 1:1?)
// Si es un único inventario por tipo, deja hasOne.
// Si tendrás varios registros (por bodega/ubicación), usa hasMany.
// Aquí te dejo la versión N:1 (más común en inventarios):
InventarioEnvase.belongsTo(EnvaseTipo, { foreignKey: 'id_envase_tipo', as: 'tipo' });
EnvaseTipo.hasMany(InventarioEnvase,   { foreignKey: 'id_envase_tipo', as: 'inventarios' });

// MovimientoEnvase ↔ EnvaseTipo (N:1)
MovimientoEnvase.belongsTo(EnvaseTipo, { foreignKey: 'id_envase_tipo', as: 'tipo' });
EnvaseTipo.hasMany(MovimientoEnvase,   { foreignKey: 'id_envase_tipo', as: 'movimientos' });

// MovimientoEnvase ↔ Lote (N:1)
MovimientoEnvase.belongsTo(Lote, { foreignKey: 'id_lote', as: 'lote' });
Lote.hasMany(MovimientoEnvase,   { foreignKey: 'id_lote', as: 'movimientos' });

// Desperdicio ↔ Lote (N:1)
Desperdicio.belongsTo(Lote, { foreignKey: 'id_lote', as: 'lote' });
Lote.hasMany(Desperdicio,   { foreignKey: 'id_lote', as: 'desperdicios' });

// Desperdicio ↔ CausaDesperdicio (N:1)
Desperdicio.belongsTo(CausaDesperdicio, { foreignKey: 'id_causa', as: 'causa' });
CausaDesperdicio.hasMany(Desperdicio,   { foreignKey: 'id_causa', as: 'desperdicios' });

// ----------------------
// Export
// ----------------------
module.exports = {
  sequelize,
  // No exportes la clase Sequelize; exportar DataTypes no es necesario
  Estilo,
  EnvaseTipo,
  CausaDesperdicio,
  Lote,
  InventarioEnvase,
  MovimientoEnvase,
  Desperdicio
};
