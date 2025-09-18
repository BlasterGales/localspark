import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

const app = express();
const PORT = 3001;
const PROJECT_ROOT = process.cwd();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ruta para chat con Ollama, enriquecido (stream simulado via generate)
app.post('/chat', async (req, res) => {
  const { message, model = 'gpt-oss:20b', contextFiles = [] } = req.body;
  let fullPrompt = message;

  // Enriquecer con contexto de archivos
  for (const filePath of contextFiles) {
    try {
      const fullPath = path.join(PROJECT_ROOT, filePath);
      const content = await fs.readFile(fullPath, 'utf8');
      fullPrompt += `\n\nContexto del archivo ${filePath}:\n${content}`;
    } catch (err) {
      fullPrompt += `\n\nError leyendo ${filePath}: ${err.message}`;
    }
  }

  // Detectar intenciones y adaptar prompt
  let adaptedPrompt = fullPrompt;
  if (message.toLowerCase().includes('fix') || message.toLowerCase().includes('arregla')) {
    adaptedPrompt = `Analiza el código y genera una versión corregida. Responde con el código nuevo en bloque markdown. Usuario: ${fullPrompt}`;
  } else if (message.toLowerCase().includes('test') || message.toLowerCase().includes('prueba')) {
    adaptedPrompt = `Sugiere o ayuda con tests. Usuario: ${fullPrompt}`;
  } else if (message.toLowerCase().includes('build') || message.toLowerCase().includes('construye')) {
    adaptedPrompt = `Sugiere comandos para build. Usuario: ${fullPrompt}`;
  }

  try {
    const ollamaRes = await fetch(`http://localhost:11434/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: adaptedPrompt,
        stream: false
      })
    });
    const data = await ollamaRes.json();
    const response = data.response;
    const hasCodeBlock = response.includes('```');
    res.json({ response, hasCodeBlock, suggestedAction: hasCodeBlock ? 'apply_fix' : null });
  } catch (err) {
    res.status(500).json({ error: 'Error con Ollama: ' + err.message });
  }
});

// Listar archivos
app.get('/files/list/:dir?', async (req, res) => {
  const dir = req.params.dir || '.';
  const fullDir = path.join(PROJECT_ROOT, dir);
  try {
    const items = await fs.readdir(fullDir, { withFileTypes: true });
    const files = items.map(item => ({ name: item.name, isDir: item.isDirectory() }));
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leer archivo
app.get('/files/read/:filePath(*)', async (req, res) => {
  const filePath = req.params.filePath;
  const fullPath = path.join(PROJECT_ROOT, filePath);
  try {
    const content = await fs.readFile(fullPath, 'utf8');
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Escribir archivo
app.post('/files/write/:filePath(*)', async (req, res) => {
  const { content } = req.body;
  const filePath = req.params.filePath;
  const fullPath = path.join(PROJECT_ROOT, filePath);
  try {
    await fs.writeFile(fullPath, content);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ejecutar comando (test/build)
app.post('/exec', async (req, res) => {
  const { command = 'npm test' } = req.body;
  try {
    const { stdout, stderr } = await execAsync(command, { cwd: PROJECT_ROOT });
    res.json({ output: stdout, error: stderr });
  } catch (err) {
    res.json({ output: err.stdout, error: err.stderr || err.message });
  }
});

app.listen(PORT, () => console.log(`Backend LocalSpark en http://localhost:${PORT}`));