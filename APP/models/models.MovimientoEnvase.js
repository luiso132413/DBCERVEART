// models.MovimientoEnvase.js
module.exports = (sequelize, Sequelize) => {
  const MovimientoEnvase = sequelize.define('MovimientoEnvase', {
    id_movimiento_envase: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_envase_tipo: {
      type: Sequelize.INTEGER,
      allowNull: false
      // FK en associations
    },
    id_lote: {
      type: Sequelize.INTEGER,
      allowNull: true
      // FK en associations (ON DELETE SET NULL configurado en asociación)
    },
    tipo_movimiento: {
      type: Sequelize.STRING(10),
      allowNull: false,
      validate: { isIn: [['ENTRADA','SALIDA','AJUSTE']] }
    },
    cantidad_unidades: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: { min: 1 }
    },
    comentario: {
      type: Sequelize.STRING(250),
      allowNull: true
    },
    fecha_movimiento: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('SYSUTCDATETIME()')
    }
  }, {
    tableName: 'MovimientoEnvase',
    timestamps: false,
    indexes: [
      { fields: ['id_envase_tipo', 'fecha_movimiento'] }
    ]
  });

  return MovimientoEnvase;
};
