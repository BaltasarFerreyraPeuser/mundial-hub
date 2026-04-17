# Figurita Mundial 2026

## Estructura del proyecto

```
figurita-2026/
├── backend/
│   ├── server.js       ← servidor Express
│   ├── package.json    ← dependencias
│   ├── .env            ← tu API key (no subir a git)
│   └── uploads/        ← se crea solo, acá van las fotos
└── frontend/
    ├── index.html
    ├── style.css
    ├── editor.js
    └── assets/         ← acá van tus 9 PNGs de capas
        ├── 2.png
        ├── 6.png
        ├── marco.png
        ├── marco6.png
        ├── cosito.png
        ├── rectanguloarriba.png
        ├── rectanguloabajo.png
        ├── logofifa.png
        └── panini.png
```

---

## Paso 1 — Copiar tus imágenes

Copiá tus 9 PNGs dentro de la carpeta `frontend/assets/`.
Los nombres tienen que ser exactamente los que figuran arriba.

---

## Paso 2 — Configurar la API key de remove.bg

1. Creá una cuenta gratis en https://www.remove.bg/api
2. Copiá tu API key
3. Abrí el archivo `backend/.env`
4. Reemplazá `TU_API_KEY_ACA` con tu key real:

```
REMOVE_BG_API_KEY=abc123tukey
```

---

## Paso 3 — Instalar dependencias del backend

Abrí la terminal, navegá a la carpeta `backend` y ejecutá:

```bash
cd figurita-2026/backend
npm install
```

Esto instala Express, Multer, Axios y el resto de paquetes.

---

## Paso 4 — Correr el servidor

```bash
npm start
```

Deberías ver:

```
✅ Servidor corriendo en http://localhost:3000
   Abrí http://localhost:3000 en tu navegador
```

---

## Paso 5 — Abrir el editor

Abrí tu navegador y entrá a:

```
http://localhost:3000
```

¡Listo! Podés subir una foto, editar los datos y descargar la figurita.

---

## Tip: recarga automática mientras desarrollás

En lugar de `npm start`, usá:

```bash
npm run dev
```

Esto usa `nodemon` que reinicia el servidor automáticamente cada vez
que guardás un cambio en el código.

---

## Preguntas frecuentes

**¿Por qué no puedo abrir el HTML directo con doble click?**
Porque el navegador bloquea las peticiones al backend por seguridad.
Siempre hay que acceder por `http://localhost:3000`.

**¿Qué pasa si no tengo API key de remove.bg?**
El servidor igual funciona — simplemente usa la foto original sin
remover el fondo y te avisa con un mensaje amarillo.

**¿Cómo subo esto a internet?**
Recomendamos Railway (https://railway.app) para el backend.
Creás una cuenta, conectás tu repo de GitHub y Railway lo despliega
solo. El frontend queda servido por el mismo backend.
