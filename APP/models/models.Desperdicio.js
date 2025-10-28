module.exports = (sequelize, Sequelize) => {
  const Desperdicio = sequelize.define('Desperdicio', {
    desperdicio_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fecha: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    lote_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    causa_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    cantidad_litros: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    notas: {
      type: Sequelize.STRING(255)
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'desperdicios'
  });

  return Desperdicio;
};
