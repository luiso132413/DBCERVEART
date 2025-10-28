module.exports = (sequelize, Sequelize) => {
  const Receta = sequelize.define('Receta', {
    id_receta: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: Sequelize.STRING(120),
      allowNull: false
    },
    id_estilo: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    rendimiento_pct: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true
    }
  }, {
    tableName: 'Receta',
    indexes: [
      {
        unique: true,
        fields: ['nombre', 'id_estilo'],
        name: 'uk_receta_nombre_estilo'
      }
    ]
  });

  return Receta;
};
