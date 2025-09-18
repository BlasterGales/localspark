# 🦙 Ollama Spark - Asistente de Desarrollo IA Local

Un clon de GitHub Spark que utiliza Ollama para ejecutar modelos de IA localmente, proporcionando una experiencia de desarrollo sin depender de servicios en la nube.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn** como gestor de paquetes
- **Ollama** instalado y ejecutándose localmente

## 🛠️ Instalación de Ollama

### Para macOS:
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Para Linux:
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Para Windows:
1. Descarga el instalador desde [ollama.ai](https://ollama.ai)
2. Ejecuta el archivo descargado y sigue las instrucciones

### Verificar instalación de Ollama:
```bash
ollama --version
```

## 🚀 Instalación del Proyecto

### 1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd ollama-spark
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar Ollama (si no está ejecutándose)
```bash
ollama serve
```

### 4. Descargar modelos de IA
Descarga al menos un modelo para usar con la aplicación:

```bash
# Modelos recomendados (elige uno o varios):

# Modelo ligero y rápido
ollama pull llama3.2:3b

# Modelo equilibrado
ollama pull llama3.2:7b

# Modelo más potente (requiere más RAM)
ollama pull llama3.2:13b

# Modelo especializado en código
ollama pull codellama:7b

# Modelo general versátil
ollama pull mistral:7b
```

### 5. Verificar que los modelos estén disponibles
```bash
ollama list
```

## 🎯 Ejecutar la Aplicación

### Modo de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

### Construir para producción:
```bash
npm run build
```

### Vista previa de la construcción:
```bash
npm run preview
```

## 📖 Cómo Usar

1. **Conexión automática**: La aplicación se conectará automáticamente a Ollama (localhost:11434)

2. **Seleccionar modelo**: En la parte superior, selecciona uno de los modelos que descargaste

3. **Subir archivos de proyecto** (opcional):
   - Usa la barra lateral izquierda para subir archivos de tu proyecto
   - Esto proporciona contexto al modelo sobre tu código

4. **Iniciar conversación**:
   - Escribe tu pregunta o solicitud en el campo de texto inferior
   - El modelo responderá basándose en tu consulta y el contexto de los archivos

## 🔧 Características

- **Chat en tiempo real** con modelos de Ollama
- **Carga de archivos de proyecto** para proporcionar contexto
- **Interfaz similar a GitHub Spark** pero completamente local
- **Múltiples modelos** disponibles según tus necesidades
- **Historial de conversaciones** persistente
- **Sintaxis highlighting** para código
- **Tema oscuro** optimizado para desarrolladores

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run preview      # Vista previa de la construcción
npm run lint         # Ejecuta el linter
npm run optimize     # Optimiza dependencias

# Ollama
ollama serve         # Inicia el servidor de Ollama
ollama list          # Lista modelos instalados
ollama pull [modelo] # Descarga un nuevo modelo
ollama rm [modelo]   # Elimina un modelo
```

## 🔍 Solución de Problemas

### Error: "No se puede conectar a Ollama"
- Verifica que Ollama esté ejecutándose: `ollama serve`
- Confirma que esté en el puerto correcto (11434): `curl http://localhost:11434/api/tags`

### Error: "No hay modelos disponibles"
- Descarga al menos un modelo: `ollama pull llama3.2:3b`
- Verifica que se instaló: `ollama list`

### Problemas de rendimiento
- Usa modelos más pequeños (3b en lugar de 13b)
- Asegúrate de tener suficiente RAM libre
- Cierra otras aplicaciones que consuman mucha memoria

### Puerto ocupado
- Mata procesos en el puerto 5000: `npm run kill`
- O usa un puerto diferente: `npm run dev -- --port 3000`

## 📊 Requisitos del Sistema

### Mínimos:
- **RAM**: 8GB (para modelos 3b)
- **Espacio**: 10GB libres
- **CPU**: Procesador moderno de 64 bits

### Recomendados:
- **RAM**: 16GB+ (para modelos 7b-13b)
- **Espacio**: 50GB+ (para múltiples modelos)
- **CPU**: 8+ núcleos
- **GPU**: Compatible con CUDA (opcional, mejora rendimiento)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Añade nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo los términos de la licencia MIT. Los recursos del Spark Template de GitHub están bajo Copyright GitHub, Inc.