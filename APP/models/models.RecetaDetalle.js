module.exports = (sequelize, Sequelize) => {
  const RecetaDetalle = sequelize.define('RecetaDetalle', {
    id_receta_detalle: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_receta: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    id_insumo: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: Sequelize.DECIMAL(14, 2),
      allowNull: false
    }
  }, {
    tableName: 'RecetaDetalle',
    indexes: [
      {
        unique: true,
        fields: ['id_receta', 'id_insumo'],
        name: 'uk_recetadetalle_receta_insumo'
      }
    ]
  });

  return RecetaDetalle;
};
