// models.Desperdicio.js
module.exports = (sequelize, Sequelize) => {
  const Desperdicio = sequelize.define('Desperdicio', {
    id_desperdicio: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_lote: {
      type: Sequelize.INTEGER,
      allowNull: false
      // FK en associations (ON DELETE CASCADE)
    },
    id_causa_desperdicio: {
      type: Sequelize.INTEGER,
      allowNull: false
      // FK en associations
    },
    id_envase_tipo: {
      type: Sequelize.INTEGER,
      allowNull: true
      // FK en associations (ON DELETE SET NULL)
    },
    litros_perdidos: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 }
    },
    detalle: {
      type: Sequelize.STRING(250),
      allowNull: true
    },
    fecha_registro: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('SYSUTCDATETIME()')
    }
  }, {
    tableName: 'Desperdicio',
    timestamps: false,
    indexes: [
      { fields: ['id_lote', 'fecha_registro'] }
    ]
  });

  return Desperdicio;
};
