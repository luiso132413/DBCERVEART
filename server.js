// Archivo: server.js
// Descripción: Punto de entrada del servidor Express. Configura la conexión a la base de datos,
// sirve el frontend y expone las rutas principales de la API.

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./app/config/db.config.js');
const mainRouter = require('./app/routers/mainRouter.js');

const app = express();

// Configuración de CORS para permitir peticiones desde el front
const corsOptions = {
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware para parsear JSON y formularios
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Servir los archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'Frontend')));

// Endpoint para verificar que el servidor está activo
app.get('/api/health', (req, res) => res.json({ ok: true, status: 'healthy' }));

// Endpoint para probar la conexión a la base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({
      ok: true,
      db: db.sequelize.config.database,
      host: db.sequelize.config.host,
      dialect: db.sequelize.getDialect()
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Montar las rutas principales de la API
app.use('/', mainRouter);

// Entregar el archivo index.html al acceder a la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'Index.html'));
});

// Si la ruta no pertenece a la API, se entrega el frontend (útil para SPA)
app.get(/^\/(?!api\/).+/, (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'Index.html'));
});

// Manejo general de errores
app.use((err, req, res, next) => {
  console.error('Error:', err?.stack || err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Puerto de ejecución
const PORT = process.env.PORT || 8080;

// Inicialización del servidor y sincronización de la base de datos
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log(`Conexión a la base de datos establecida: ${db.sequelize.config.database}`);

    await db.sequelize.sync({ alter: true });
    console.log('Modelos sincronizados correctamente');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Frontend:  http://localhost:${PORT}/Index.html`);
      console.log(`API base:  http://localhost:${PORT}/api`);
      console.log('Sirviendo archivos desde:', path.join(__dirname, 'Frontend'));
    });
  } catch (err) {
    console.error('Error al iniciar o conectar la base de datos:', err?.message || err);
    process.exit(1);
  }
})();

module.exports = app;
