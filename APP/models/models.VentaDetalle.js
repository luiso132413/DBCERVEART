module.exports = (sequelize, Sequelize) => {
  const VentaDetalle = sequelize.define('VentaDetalle', {
    id_venta_detalle: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_venta: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    id_producto: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    precio_unit: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false
    }
    // Nota: subtotal se calcula en la app = cantidad * precio_unit
  }, {
    tableName: 'VentaDetalle',
    indexes: [
      { fields: ['id_venta'] },
      { fields: ['id_producto'] }
    ]
  });

  return VentaDetalle;
};
