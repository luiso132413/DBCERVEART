module.exports = (sequelize, Sequelize) => {
  const Lote = sequelize.define('Lote', {
    id_lote: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo_lote: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: true
    },
    id_receta: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    volumen_plan_lt: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false
    },
    fecha_inicio: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    fecha_fin: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    estado: {
      type: Sequelize.ENUM('EN_PROCESO', 'LISTO', 'CANCELADO'),
      allowNull: false,
      defaultValue: 'EN_PROCESO'
    },
    observaciones: {
      type: Sequelize.STRING(300),
      allowNull: true
    }
  }, {
    tableName: 'Lote'
  });

  return Lote;
};
