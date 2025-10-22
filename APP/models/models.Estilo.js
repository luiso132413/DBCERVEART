// APP/models/Estilo.model.js
module.exports = (sequelize, Sequelize) => {
  const Estilo = sequelize.define('Estilo', {
    id_estilo: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_estilo: {
      type: Sequelize.STRING(80),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'nombre_estilo no puede estar vacío' },
        len: { args: [1, 80], msg: 'nombre_estilo (1-80 chars)' }
      },
      set(v) {
        // normaliza entrada para evitar errores por espacios/case
        const limpio = (v ?? '').toString().trim().toUpperCase();
        this.setDataValue('nombre_estilo', limpio);
      }
    }
  }, {
    tableName: 'Estilo',
    timestamps: false,
    freezeTableName: true
  });

  return Estilo;
};
