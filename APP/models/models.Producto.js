module.exports = (sequelize, Sequelize) => {
  const Producto = sequelize.define('Producto', {
    id_producto: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: Sequelize.STRING(120),
      allowNull: false,
      unique: true
    },
    id_estilo: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    presentacion_ml: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    tipo_envase: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    activo: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'Producto'
  });

  return Producto;
};
