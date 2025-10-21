module.exports = (sequelize, Sequelize) => {
  const Estilo = sequelize.define('Estilo', {
    id_estilo: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_estilo: {
      type: Sequelize.STRING(80),
      allowNull: false
      // sin unique aquí, lo aplicamos vía constraint desde server.js
    }
  }, {
    tableName: 'Estilo',
    timestamps: false,        // recomendable para tablas limpias sin createdAt/updatedAt
    freezeTableName: true     // evita pluralización automática ("Estilos")
  });

  return Estilo;
};
