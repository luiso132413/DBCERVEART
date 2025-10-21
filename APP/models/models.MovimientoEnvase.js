module.exports = (sequelize, Sequelize) => {
  const MovimientoEnvase = sequelize.define('MovimientoEnvase', {
    id_mov: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_envase_tipo: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    fecha: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('SYSUTCDATETIME()') // default de tu tabla
    },
    tipo_mov: {
      type: Sequelize.ENUM('ENTRADA', 'SALIDA'),
      allowNull: false
    },
    cantidad: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    id_lote: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    nota: {
      type: Sequelize.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'MovimientoEnvase'
  });

  return MovimientoEnvase;
};
