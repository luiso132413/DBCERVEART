module.exports = (sequelize, Sequelize) => {
  const EnvaseTipo = sequelize.define('EnvaseTipo', {
    envase_tipo_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    capacidad_ml: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'envases_tipo'
  });

  return EnvaseTipo;
};
