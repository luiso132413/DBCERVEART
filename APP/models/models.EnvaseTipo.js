module.exports = (sequelize, Sequelize) => {
  const EnvaseTipo = sequelize.define('EnvaseTipo', {
    id_envase_tipo: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_tipo: {
      type: Sequelize.ENUM('LATA', 'BARRIL', 'BOTELLA'),
      allowNull: false
    },
    capacidad_litros: {
      type: Sequelize.DECIMAL(6, 2),
      allowNull: false
    }
  }, {
    tableName: 'EnvaseTipo',
    indexes: [
      { unique: true, fields: ['nombre_tipo', 'capacidad_litros'] } // refleja UQ de la BD
    ]
  });

  return EnvaseTipo;
};
