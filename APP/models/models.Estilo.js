module.exports = (sequelize, Sequelize) => {
  const Estilo = sequelize.define('Estilo', {
    id_estilo: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: Sequelize.STRING(80),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'Estilo'
  });

  return Estilo;
};
