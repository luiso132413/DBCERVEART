module.exports = (sequelize, Sequelize) => {
  const Desperdicio = sequelize.define('Desperdicio', {
    id_desperdicio: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipo: {
      type: Sequelize.ENUM('INSUMO', 'PRODUCTO'),
      allowNull: false
    },
    id_insumo: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    id_producto: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    cantidad: {
      type: Sequelize.DECIMAL(14, 2),
      allowNull: false
    },
    motivo: {
      type: Sequelize.STRING(150),
      allowNull: false
    },
    fecha_registro: {
      type: Sequelize.DATEONLY,
      allowNull: false
    }
  }, {
    tableName: 'Desperdicio'
  });

  return Desperdicio;
};
