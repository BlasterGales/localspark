# Ollama Spark - Local AI Development Assistant

Una interfaz local elegante para interactuar con modelos de Ollama, diseñada específicamente para desarrolladores.

## 🚀 Características

- **Interfaz moderna**: Diseño limpio inspirado en GitHub Spark
- **Soporte completo de Ollama**: Conexión directa con tu instalación local
- **Contexto de proyecto**: Sube archivos para proporcionar contexto al AI
- **Streaming en tiempo real**: Respuestas fluidas mientras el AI piensa
- **Gestión robusta de errores**: Manejo gracioso de desconexiones y errores
- **Persistencia de datos**: Conversaciones y archivos se guardan automáticamente

## 📋 Prerrequisitos

### 1. Node.js y npm
```bash
# Verificar instalación
node --version  # Debe ser v18 o superior
npm --version   # Debe ser v8 o superior
```

Si no tienes Node.js instalado:
- **Windows/Mac**: Descarga desde [nodejs.org](https://nodejs.org/)
- **Linux (Ubuntu/Debian)**:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

### 2. Ollama
Ollama debe estar instalado y ejecutándose en tu sistema.

#### Instalación de Ollama:

**macOS:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Descarga el instalador desde [ollama.ai](https://ollama.ai/download)

#### Verificar instalación de Ollama:
```bash
ollama --version
```

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd ollama-spark
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Verificar que Ollama esté ejecutándose
```bash
# Iniciar Ollama (si no está ejecutándose)
ollama serve

# En otra terminal, verificar la conexión
curl http://localhost:11434/api/tags
```

Si ves una respuesta JSON, Ollama está funcionando correctamente.

### 4. Descargar modelos de AI

**Modelos recomendados para desarrollo:**

```bash
# Modelo pequeño y rápido (ideal para desarrollo)
ollama pull llama2:7b

# Modelo más capaz (requiere más recursos)
ollama pull codellama:13b

# Modelo especializado en código
ollama pull codellama:python

# Modelo muy ligero para pruebas
ollama pull tinyllama
```

**Para verificar modelos instalados:**
```bash
ollama list
```

## 🏃‍♂️ Ejecutar la Aplicación

### Modo Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

### Modo Producción
```bash
# Construir la aplicación
npm run build

# Servir la aplicación construida
npm run preview
```

## 🔧 Resolución de Problemas

### Error: "Cannot connect to Ollama"

**1. Verificar que Ollama esté ejecutándose:**
```bash
# Comprobar proceso
ps aux | grep ollama

# Si no está ejecutándose, iniciarlo
ollama serve
```

**2. Verificar puerto:**
```bash
# Ollama debe ejecutarse en puerto 11434
netstat -tlnp | grep 11434
```

**3. Verificar conexión:**
```bash
curl http://localhost:11434/api/tags
```

### Error: "No models available"

**Descargar al menos un modelo:**
```bash
ollama pull llama2:7b
```

**Verificar modelos descargados:**
```bash
ollama list
```

### Puerto ocupado (Error EADDRINUSE)

**Cambiar puerto de desarrollo:**
```bash
# Editar package.json o usar variable de entorno
PORT=3001 npm run dev
```

### Problemas de rendimiento

**Para modelos grandes:**
- Asegúrate de tener suficiente RAM (8GB+ recomendado)
- Cierra otras aplicaciones pesadas
- Considera usar modelos más pequeños (`tinyllama`, `llama2:7b`)

**Optimizar Ollama:**
```bash
# Configurar límite de memoria (ejemplo: 4GB)
export OLLAMA_MAX_LOADED_MODELS=1
export OLLAMA_MAX_QUEUE=1
```

## 🎯 Uso de la Aplicación

### 1. Primera vez
1. Abre `http://localhost:5173`
2. Espera a que se conecte con Ollama
3. Selecciona un modelo del dropdown
4. ¡Comienza a chatear!

### 2. Subir archivos de proyecto
1. Arrastra archivos a la barra lateral izquierda
2. O usa el botón "Choose Files"
3. Los archivos proporcionan contexto al AI

### 3. Tipos de archivos soportados
- JavaScript/TypeScript (`.js`, `.jsx`, `.ts`, `.tsx`)
- Estilos (`.css`, `.scss`, `.less`)
- Markup (`.html`, `.xml`)
- Datos (`.json`, `.yaml`, `.yml`)
- Documentación (`.md`, `.txt`)
- Código (`.py`, `.java`, `.cpp`, `.c`, `.h`)

### 4. Comandos útiles
- **Enter**: Enviar mensaje
- **Shift + Enter**: Nueva línea
- **Ctrl/Cmd + R**: Refrescar conexión

## 🔒 Seguridad y Privacidad

- **100% Local**: Toda la comunicación es local, nada se envía a internet
- **Sin telemetría**: No se recopilan datos de uso
- **Datos persistentes**: Conversaciones se guardan localmente en tu navegador
- **Archivos seguros**: Los archivos subidos solo existen en tu sesión local

## 🛠️ Desarrollo y Personalización

### Estructura del proyecto
```
src/
├── components/          # Componentes React
├── lib/                # Utilidades y API
├── assets/             # Recursos estáticos
└── styles/             # Estilos globales
```

### Scripts disponibles
```bash
npm run dev             # Servidor de desarrollo
npm run build           # Construir para producción
npm run preview         # Vista previa de build
npm run lint            # Linter de código
npm run type-check      # Verificación de tipos
```

### Personalizar tema
Edita `src/index.css` para cambiar colores y estilos.

## 📚 Comandos de Ollama Útiles

```bash
# Gestión de modelos
ollama list                          # Listar modelos instalados
ollama pull <modelo>                 # Descargar modelo
ollama rm <modelo>                   # Eliminar modelo
ollama show <modelo>                 # Información del modelo

# Administración
ollama serve                         # Iniciar servidor
ollama ps                           # Procesos activos
ollama stop <modelo>                # Detener modelo específico

# Ejemplos de uso directo
ollama run llama2:7b "Hello world"  # Ejecutar prompt directo
```

## 🤝 Soporte

Si encuentras problemas:

1. **Verifica prerrequisitos**: Node.js, Ollama instalados y funcionando
2. **Consulta logs**: Abre DevTools del navegador (F12) y revisa la consola
3. **Reinicia servicios**: Detén y reinicia tanto Ollama como la aplicación
4. **Verifica recursos**: Asegúrate de tener suficiente RAM disponible

## 📝 Notas Adicionales

- La primera ejecución puede ser lenta mientras los modelos se cargan
- Los modelos más grandes ofrecen mejores respuestas pero requieren más recursos
- Guarda tus conversaciones importantes, ya que se almacenan localmente
- Puedes ejecutar múltiples instancias de Ollama con diferentes configuraciones

---

**¡Disfruta desarrollando con tu asistente AI local!** 🚀