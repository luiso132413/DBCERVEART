module.exports = (sequelize, Sequelize) => {
  const MovimientoEnvase = sequelize.define('MovimientoEnvase', {
    movimiento_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fecha: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    tipo: {
      type: Sequelize.ENUM('ENTRADA', 'SALIDA', 'AJUSTE'),
      allowNull: false
    },
    envase_tipo_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    lote_id: {
      type: Sequelize.INTEGER
    },
    cantidad: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    detalle: {
      type: Sequelize.STRING(255)
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'movimientos_envase'
  });

  return MovimientoEnvase;
};
