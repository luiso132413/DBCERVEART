module.exports = (sequelize, Sequelize) => {
  const InventarioEnvase = sequelize.define('InventarioEnvase', {
    id_envase_tipo: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    cantidad_envase: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'InventarioEnvase'
  });

  return InventarioEnvase;
};
