// models.EnvaseTipo.js
module.exports = (sequelize, Sequelize) => {
  const EnvaseTipo = sequelize.define('EnvaseTipo', {
    id_envase_tipo: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: Sequelize.STRING(40),
      allowNull: false
    },
    capacidad_ml: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    activo: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    creado_en: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('SYSUTCDATETIME()')
    }
  }, {
    tableName: 'EnvaseTipo',
    timestamps: false,
    indexes: [
      // Único compuesto (nombre, capacidad_ml)
      { unique: true, fields: ['nombre', 'capacidad_ml'] }
    ]
  });

  return EnvaseTipo;
};
