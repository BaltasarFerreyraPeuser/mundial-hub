const express  = require('express');
const multer   = require('multer');
const cors     = require('cors');
const fs       = require('fs');
const path     = require('path');
const { execFile } = require('child_process');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ── CARPETA DE UPLOADS ────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// Servir frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/uploads', express.static(UPLOADS_DIR));

// ── MULTER ────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Solo JPG, PNG o WEBP'));
  }
});

// ── CONFIGURACIÓN DE RUTAS ───────────────────────────────────
const isWin = process.platform === 'win32';

// Buscamos el ejecutable dentro de tu carpeta de proyecto
const REMBG_EXE = path.join(__dirname, 'venv', 'Scripts', 'rembg.exe');

// ── VERIFICAR SI rembg EXISTE ──
function checkRembg() {
    return new Promise(resolve => {
        // Verificamos si el archivo físico está en la carpeta venv
        fs.access(REMBG_EXE, fs.constants.F_OK, (err) => resolve(!err));
    });
}

// ── REMOVE BG ──
function removeBackgroundRembg(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        // Ejecutamos el rembg que está DENTRO de tu proyecto
        execFile(REMBG_EXE, ['i', '-m', 'u2net_human_seg', inputPath, outputPath],
            { timeout: 180000 },
            (err, stdout, stderr) => {
                if (err) reject(new Error(stderr || err.message));
                else resolve();
            }
        );
    });
}
app.post('/api/remove-bg', upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió imagen' });

  const inputPath  = req.file.path;
  const resultName = 'nobg-' + path.basename(inputPath, path.extname(inputPath)) + '.png';
  const outputPath = path.join(UPLOADS_DIR, resultName);

  try {
    await removeBackgroundRembg(inputPath, outputPath);

    fs.unlink(inputPath, () => {});

    res.json({ url: '/uploads/' + resultName });

  } catch (err) {
    console.error('Error rembg:', err.message);

    // Fallback: si rembg falla, devolver la foto original
    fs.unlink(inputPath, () => {});
    res.json({
      url:     '/uploads/' + req.file.filename,
      warning: 'No se pudo remover el fondo automáticamente. Se usó la foto original.'
    });
  }
});

// ── STATUS ────────────────────────────────────────────────────
app.get('/api/status', async (req, res) => {
  const rembgOk = await checkRembg();
  res.json({
    status:      'ok',
    rembg:       rembgOk ? 'instalado' : 'no encontrado',
    rembg_note:  rembgOk ? null : 'Instalá rembg con: pip install rembg[cpu]'
  });
});

// ── INICIAR ───────────────────────────────────────────────────
app.listen(PORT, async () => {
  const rembgOk = await checkRembg();
  console.log(`\n✅ Servidor en http://localhost:${PORT}`);
  if (rembgOk) {
    console.log('✅ rembg detectado — remove de fondo funcionando');
  } else {
    console.log('⚠️  rembg NO encontrado. Instalalo con:');
    console.log('   pip install rembg[cpu]');
    console.log('   (la primera vez descarga el modelo ~170MB, luego es offline)\n');
  }
});
