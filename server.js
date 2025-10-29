// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
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

app.use('/api', mainRouter);

app.get('/api/health', (req, res) => res.json({ ok: true, status: 'healthy' }));
app.get('/', (req, res) => res.json({ mensaje: 'Bienvenido Estudiantes de UMG' }));

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
    });
  } catch (err) {
    console.error('Error al iniciar o conectar la base de datos:', err?.message || err);
    process.exit(1);
  }
})();

module.exports = app;
