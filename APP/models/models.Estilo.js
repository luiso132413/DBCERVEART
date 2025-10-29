module.exports = (sequelize, Sequelize) => {
  const Estilo = sequelize.define('Estilo', {
    estilo_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    abv: {
      type: Sequelize.FLOAT
    },
    notas: {
      type: Sequelize.STRING(255)
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'estilos'
  });

  return Estilo;
};
