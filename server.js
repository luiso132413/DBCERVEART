const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./APP/models/models.index.js');
const mainRouter = require('./APP/routers/mainRouter.js');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  optionsSuccessStatus: 200
}));

// Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', mainRouter);
app.get('/', (_, res) => {
  res.json({ mensaje: 'Bienvenido Estudiantes de UMG' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicialización del servidor y sincronización de base de datos
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Conexión a la base de datos establecida');

    // Sincronización sin alter para evitar conflictos de UNIQUE
    await db.sequelize.sync();
    console.log('Modelos sincronizados correctamente');

    // Aplicar constraint UNIQUE a Estilo.nombre_estilo (solo si no existe)
    const qi = db.sequelize.getQueryInterface();
    try {
      await qi.addConstraint('Estilo', {
        fields: ['nombre_estilo'],
        type: 'unique',
        name: 'UQ_Estilo_nombre_estilo'
      });
      console.log('Constraint UNIQUE creado en Estilo.nombre_estilo');
    } catch (e) {
      if (e?.original?.number === 2714 || /already exists/i.test(e?.message || '')) {
        console.log('Constraint UNIQUE ya existía');
      } else {
        console.error('Error al crear el constraint UNIQUE:', e);
      }
    }

    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error durante la inicialización:', err?.original?.code || err.message, err?.original || err);
    process.exit(1);
  }
})();

module.exports = app;
