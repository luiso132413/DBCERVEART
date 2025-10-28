// models.Lote.js
module.exports = (sequelize, Sequelize) => {
  const Lote = sequelize.define('Lote', {
    id_lote: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: true
    },
    id_estilo: {
      type: Sequelize.INTEGER,
      allowNull: false
      // FK se declara en associations (models.index.js)
    },
    fecha_inicio: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    fecha_fin: {
      type: Sequelize.DATEONLY,
      allowNull: true
    },
    volumen_planeado_litros: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0.01 }
    },
    volumen_obtenido_litros: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      validate: { min: 0 }
    },
    estado: {
      type: Sequelize.STRING(15),
      allowNull: false,
      defaultValue: 'EN_PROCESO',
      validate: {
        isIn: [['EN_PROCESO','FINALIZADO','CANCELADO']]
      }
    },
    creado_en: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('SYSUTCDATETIME()')
    }
  }, {
    tableName: 'Lote',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['codigo'] },
      { fields: ['id_estilo'] }
    ]
  });

  return Lote;
};
