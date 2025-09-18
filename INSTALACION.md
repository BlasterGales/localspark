# 📋 Guía de Instalación Detallada - Ollama Spark

Esta guía te llevará paso a paso desde la clonación del repositorio hasta tener Ollama Spark completamente funcional.

## 🔍 Verificación de Requisitos

### 1. Verificar Node.js
```bash
node --version
npm --version
```
- **Versión mínima requerida**: Node.js 18+
- Si no tienes Node.js: [Descargar desde nodejs.org](https://nodejs.org)

### 2. Verificar sistema operativo
```bash
# Linux/macOS
uname -a

# Windows (PowerShell)
Get-ComputerInfo
```

## 🔄 Proceso de Instalación Completo

### Paso 1: Clonar el Repositorio
```bash
# Clona el repositorio
git clone https://github.com/[usuario]/ollama-spark.git

# Navega al directorio
cd ollama-spark

# Verifica el contenido
ls -la
```

### Paso 2: Instalar Ollama

#### En macOS:
```bash
# Instalación con Homebrew (recomendado)
brew install ollama

# O usando curl
curl -fsSL https://ollama.ai/install.sh | sh
```

#### En Ubuntu/Debian:
```bash
# Descargar e instalar
curl -fsSL https://ollama.ai/install.sh | sh

# Verificar instalación
which ollama
```

#### En Windows:
1. Ve a [ollama.ai](https://ollama.ai)
2. Descarga `OllamaSetup.exe`
3. Ejecuta como administrador
4. Sigue el asistente de instalación

#### En Arch Linux:
```bash
# Usando AUR
yay -S ollama

# O usando pacman si está en repositorios oficiales
sudo pacman -S ollama
```

### Paso 3: Configurar Ollama

#### Iniciar el servicio:
```bash
# Iniciar Ollama en primer plano (recomendado para desarrollo)
ollama serve

# O como servicio en segundo plano (Linux/macOS)
systemctl --user start ollama
```

#### Verificar que está funcionando:
```bash
# Debería mostrar la lista de modelos (vacía inicialmente)
curl http://localhost:11434/api/tags

# O usar el comando de Ollama
ollama list
```

### Paso 4: Descargar Modelos

#### Modelos recomendados por uso:

**Para desarrollo general (recomendado para empezar):**
```bash
ollama pull llama3.2:3b
```

**Para análisis de código más profundo:**
```bash
ollama pull codellama:7b
```

**Para conversaciones generales:**
```bash
ollama pull mistral:7b
```

**Para tareas avanzadas (requiere más recursos):**
```bash
ollama pull llama3.2:13b
```

#### Verificar descarga:
```bash
ollama list
```

### Paso 5: Instalar Dependencias del Proyecto

```bash
# Asegúrate de estar en el directorio del proyecto
cd ollama-spark

# Instalar dependencias
npm install

# Verificar que no hay errores
npm audit
```

### Paso 6: Configuración Adicional (Opcional)

#### Configurar variables de entorno:
```bash
# Crear archivo .env.local (opcional)
touch .env.local

# Agregar configuraciones personalizadas
echo "OLLAMA_BASE_URL=http://localhost:11434" >> .env.local
```

#### Verificar puertos disponibles:
```bash
# Verificar que el puerto 5173 esté libre
lsof -i :5173

# Verificar que Ollama está en 11434
lsof -i :11434
```

## 🚀 Primera Ejecución

### 1. Iniciar Ollama (si no está ejecutándose)
```bash
# En una terminal
ollama serve
```

### 2. Iniciar la aplicación
```bash
# En otra terminal
npm run dev
```

### 3. Verificar funcionamiento
1. Abre tu navegador en `http://localhost:5173`
2. Verifica que aparece el selector de modelos
3. Selecciona un modelo descargado
4. Envía un mensaje de prueba: "Hola, ¿puedes ayudarme?"

## 🔧 Configuración Avanzada

### Configurar Ollama con GPU (NVIDIA)

#### En Linux:
```bash
# Instalar NVIDIA Container Toolkit
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg

# Ejecutar Ollama con GPU
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

#### Verificar uso de GPU:
```bash
# Mientras Ollama está ejecutándose
nvidia-smi
```

### Configurar límites de memoria:
```bash
# Limitar uso de memoria de Ollama
export OLLAMA_MAX_LOADED_MODELS=1
export OLLAMA_MAX_QUEUE=512
ollama serve
```

## 🔍 Verificación de Instalación Completa

### Lista de verificación:
- [ ] Node.js 18+ instalado
- [ ] Ollama instalado y ejecutándose
- [ ] Al menos un modelo descargado
- [ ] Dependencias npm instaladas
- [ ] Aplicación ejecutándose en localhost:5173
- [ ] Selector de modelos funcional
- [ ] Chat respondiendo mensajes

### Comandos de verificación:
```bash
# Verificar versiones
node --version
npm --version
ollama --version

# Verificar servicios
curl http://localhost:11434/api/tags
curl http://localhost:5173

# Verificar modelos
ollama list

# Verificar dependencias
npm list --depth=0
```

## 🆘 Resolución de Problemas Comunes

### Error: "Command not found: ollama"
```bash
# Verificar instalación
which ollama

# Agregar al PATH (si es necesario)
export PATH=$PATH:/usr/local/bin
```

### Error: "Cannot connect to Ollama"
```bash
# Verificar si Ollama está ejecutándose
ps aux | grep ollama

# Reiniciar Ollama
pkill ollama
ollama serve
```

### Error: "Port 11434 already in use"
```bash
# Encontrar y matar proceso
lsof -ti:11434 | xargs kill -9

# O usar puerto diferente
OLLAMA_HOST=0.0.0.0:11435 ollama serve
```

### Error de memoria insuficiente:
```bash
# Usar modelo más pequeño
ollama pull llama3.2:1b

# O limpiar memoria
ollama stop [modelo]
```

### Problemas con npm install:
```bash
# Limpiar cache
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📞 Soporte

Si encuentras problemas:

1. **Verifica los logs**: `ollama logs` (si disponible)
2. **Revisa la documentación**: [ollama.ai/docs](https://ollama.ai/docs)
3. **Issues del proyecto**: Crea un issue en el repositorio
4. **Comunidad**: Discord de Ollama o foros de GitHub

## 🎉 ¡Listo para usar!

Una vez completados todos los pasos, tendrás:
- Ollama Spark funcionando localmente
- Interfaz web accesible desde tu navegador  
- Modelos de IA disponibles para chat
- Capacidad de subir archivos de proyecto para contexto
- Historial persistente de conversaciones

¡Disfruta desarrollando con tu asistente de IA local!