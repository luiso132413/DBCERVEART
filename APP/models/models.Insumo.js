module.exports = (sequelize, Sequelize) => {
  const Insumo = sequelize.define('Insumo', {
    id_insumo: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: Sequelize.STRING(120),
      allowNull: false,
      unique: true
    },
    unidad: {
      type: Sequelize.STRING(10),
      allowNull: false
    },
    costo_unitario: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false
    },
    stock_actual: {
      type: Sequelize.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0
    },
    punto_reorden: {
      type: Sequelize.DECIMAL(14, 2),
      allowNull: true
    }
  }, {
    tableName: 'Insumo'
  });

  return Insumo;
};
