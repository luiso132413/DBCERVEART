module.exports = (sequelize, Sequelize) => {
  const Lote = sequelize.define('Lote', {
    lote_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    estilo_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    fecha_inicio: {
      type: Sequelize.DATE,
      allowNull: false
    },
    fecha_fin: {
      type: Sequelize.DATE
    },
    volumen_producido_litros: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    estado: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'lotes'
  });

  return Lote;
};
