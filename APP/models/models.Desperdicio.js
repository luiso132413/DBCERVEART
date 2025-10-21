module.exports = (sequelize, Sequelize) => {
  const Desperdicio = sequelize.define('Desperdicio', {
    id_desp: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_lote: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    fecha: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    litros: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    id_causa: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    comentario: {
      type: Sequelize.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'Desperdicio'
  });

  return Desperdicio;
};
