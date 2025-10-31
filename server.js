// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./app/config/db.config.js');
const mainRouter = require('./app/routers/mainRouter.js');

const app = express();

const corsOptions = {
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del front
app.use(express.static(path.join(__dirname, 'Frontend')));

// Rutas de salud y diagnóstico
app.get('/api/health', (req, res) => res.json({ ok: true, status: 'healthy' }));
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

// API (tus rutas ya incluyen /api)
app.use('/', mainRouter);

// Entregar el Index del front en la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'Index.html'));
});

// Fallback opcional: cualquier ruta no-API devuelve el Index (para múltiples páginas)
app.get(/^\/(?!api\/).+/, (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'Index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err?.stack || err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log(`Conexión a la base de datos establecida: ${db.sequelize.config.database}`);

    await db.sequelize.sync({ alter: true });
    console.log('Modelos sincronizados');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Frontend:  http://localhost:${PORT}/Index.html`);
      console.log(`API base:  http://localhost:${PORT}/api`);
      console.log('Estáticos desde:', path.join(__dirname, 'Frontend'));
    });
  } catch (err) {
    console.error('Error al iniciar o conectar la base de datos:', err?.message || err);
    process.exit(1);
  }
})();

module.exports = app;
