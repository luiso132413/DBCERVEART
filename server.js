const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./APP/models/models.index.js');
const mainRouter = require('./APP/routers/mainRouter.js');

const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  optionsSuccessStatus: 200
}));

// Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', mainRouter);
app.get('/', (_, res) => res.json({ mensaje: 'Bienvenido Estudiantes de UMG' }));

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

    // No toques el DDL automáticamente.
    await db.sequelize.sync({ alter: false, force: false });
    console.log('Modelos sincronizados correctamente');

    // -------- Guardrails idempotentes para Estilo --------
    // - Remueve UNIQUE viejo si aún existe
    // - Asegura columna calculada normalizada (persistida)
    // - Asegura CHECK de no-vacío
    // - Asegura índice único sobre la normalización
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
      // No abortamos el server, pero lo dejamos registrado.
    }
    // -----------------------------------------------------

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
