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
    fecha_inicio_lote: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    fecha_fin_lote: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    litros_producidos: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    estado: {
      type: Sequelize.ENUM('EN PROCESO', 'COMPLETADO', 'DESCARTADO'),
      allowNull: false
    },
    id_estilo: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'Lote'
  });

  return Lote;
};
