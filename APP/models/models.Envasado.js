module.exports = (sequelize, Sequelize) => {
  const Envasado = sequelize.define('Envasado', {
    id_envasado: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_lote: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    id_producto: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    cantidad_unidades: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    fecha_envasado: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    observaciones: {
      type: Sequelize.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'Envasado'
  });

  return Envasado;
};
