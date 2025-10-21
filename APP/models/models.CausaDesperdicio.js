module.exports = (sequelize, Sequelize) => {
  const CausaDesperdicio = sequelize.define('CausaDesperdicio', {
    id_causa: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_desperdicio: {
      type: Sequelize.STRING(80),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'CausaDesperdicio'
  });

  return CausaDesperdicio;
};
