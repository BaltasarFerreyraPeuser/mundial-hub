// JavaScript source code
const { exec } = require('child_process');

console.log("--- DIAGNÓSTICO DE ENTORNO ---");
console.log("Plataforma:", process.platform);
console.log("Directorio actual:", __dirname);

// 1. ¿Node ve a Python?
exec('python --version', (err, stdout, stderr) => {
    console.log("\n1. ¿Python en PATH?:", err ? "NO ❌" : `SÍ ✅ (${stdout.trim()})`);

    // 2. ¿Dónde está el ejecutable de rembg?
    exec('where rembg', (err, stdout, stderr) => {
        console.log("2. Ubicación de rembg.exe:", err ? "NO ENCONTRADO ❌" : `\n${stdout.trim()}`);

        // 3. ¿Funciona como módulo de Python?
        exec('python -m rembg --help', (err, stdout, stderr) => {
            console.log("\n3. ¿Funciona como módulo (python -m rembg)?:", err ? "NO ❌" : "SÍ ✅");
            if (err) console.log("ERROR DETALLADO:", stderr);
        });
    });
});