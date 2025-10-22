const path = require('path');            // 👈 nuevo
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./APP/models/models.index.js');
const mainRouter = require('./APP/routers/mainRouter.js');

const app = express();

/* ==== CORS (dev) ====
   Como serviremos el front desde el MISMO origen (http://localhost:8081),
   realmente no hará falta CORS para el front. Lo dejo abierto por si pruebas
   el front desde otro puerto en desarrollo. En prod, cierra esto a tu dominio. */
app.use(cors({
  origin: (origin, cb) => {
    const allow = [
      'http://localhost:8081', 'http://127.0.0.1:8081', // mismo server (front servido por Express)
      'http://localhost:8080', 'http://127.0.0.1:8080', // http-server / vite
      'http://localhost:5500', 'http://127.0.0.1:5500', // Live Server
      'http://localhost:4200', 'http://127.0.0.1:4200', // Angular
    ];
    // origin puede ser undefined en tools/curl; 'null' para file://
    if (!origin || origin === 'null' || allow.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  optionsSuccessStatus: 200
}));

// Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api', mainRouter);
app.get('/api/health', (_, res) => res.json({ ok: true }));

// ======= Servir FRONTEND estático =======
// Coloca tu carpeta "frontend" al nivel de server.js
const FRONT_DIR = path.join(__dirname, 'frontend');
app.use(express.static(FRONT_DIR));
// fallback a index.html (SPA)
app.get('/', (req, res) => res.sendFile(path.join(FRONT_DIR, 'index.html')));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicialización del servidor y sincronización de base de datos
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Conexión a la base de datos establecida');

    await db.sequelize.sync({ alter: false, force: false });
    console.log('Modelos sincronizados correctamente');

    // Guardrails de Estilo (tu bloque tal cual)
    try {
      await db.sequelize.query(`
        IF EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = 'UQ_Estilo_nombre_estilo')
          ALTER TABLE dbo.Estilo DROP CONSTRAINT UQ_Estilo_nombre_estilo;

        IF COL_LENGTH('dbo.Estilo', 'nombre_estilo_norm') IS NULL
          ALTER TABLE dbo.Estilo
            ADD nombre_estilo_norm AS UPPER(LTRIM(RTRIM(nombre_estilo))) PERSISTED;

        IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Estilo_nombre_estilo_not_blank')
          ALTER TABLE dbo.Estilo
            ADD CONSTRAINT CK_Estilo_nombre_estilo_not_blank
            CHECK (LEN(LTRIM(RTRIM(nombre_estilo))) > 0);

        IF NOT EXISTS (
          SELECT 1 FROM sys.indexes
          WHERE name = 'UX_Estilo_nombre_estilo_norm'
            AND object_id = OBJECT_ID('dbo.Estilo')
        )
          CREATE UNIQUE INDEX UX_Estilo_nombre_estilo_norm
          ON dbo.Estilo (nombre_estilo_norm);
      `);
      console.log('Guardrails de Estilo verificados (idempotentes)');
    } catch (e) {
      console.error('Error aplicando guardrails de Estilo:', e?.message || e);
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
