module.exports = (sequelize, Sequelize) => {
  const Cliente = sequelize.define('Cliente', {
    id_cliente: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: Sequelize.STRING(120),
      allowNull: false
    },
    nit: {
      type: Sequelize.STRING(25),
      allowNull: true
    },
    telefono: {
      type: Sequelize.STRING(30),
      allowNull: true
    },
    email: {
      type: Sequelize.STRING(120),
      allowNull: true
    },
    activo: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'Cliente'
  });

  return Cliente;
};
