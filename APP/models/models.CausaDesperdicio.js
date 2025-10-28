module.exports = (sequelize, Sequelize) => {
  const CausaDesperdicio = sequelize.define('CausaDesperdicio', {
    causa_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'causas_desperdicio'
  });

  return CausaDesperdicio;
};
