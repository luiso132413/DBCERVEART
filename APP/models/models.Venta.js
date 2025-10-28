module.exports = (sequelize, Sequelize) => {
  const Venta = sequelize.define('Venta', {
    id_venta: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    serie: {
      type: Sequelize.STRING(10),
      allowNull: false,
      defaultValue: 'A',
      unique: 'uk_venta_serie_numero'
    },
    numero: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: 'uk_venta_serie_numero'
    },
    id_cliente: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    fecha_venta: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    monto_total: {
      type: Sequelize.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0
    },
    estado: {
      type: Sequelize.ENUM('EMITIDA', 'ANULADA'),
      allowNull: false,
      defaultValue: 'EMITIDA'
    }
  }, {
    tableName: 'Venta',
    indexes: [
      {
        unique: true,
        fields: ['serie', 'numero'],
        name: 'uk_venta_serie_numero'
      }
    ]
  });

  return Venta;
};
