// models.CausaDesperdicio.js
module.exports = (sequelize, Sequelize) => {
  const CausaDesperdicio = sequelize.define('CausaDesperdicio', {
    id_causa_desperdicio: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: Sequelize.STRING(80),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: Sequelize.STRING(250),
      allowNull: true
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
    tableName: 'CausaDesperdicio',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['nombre'] }
    ]
  });

  return CausaDesperdicio;
};
