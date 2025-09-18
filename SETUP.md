# Ollama Spark - Instalación y Configuración

Una interfaz local para interactuar con modelos de Ollama, inspirada en GitHub Spark.

## Prerrequisitos

1. **Node.js** (versión 18 o superior)
   - Descargar desde: https://nodejs.org/
   - Verificar instalación: `node --version`

2. **Ollama** instalado y ejecutándose
   - Descargar desde: https://ollama.ai/download
   - Verificar instalación: `ollama --version`

## Instalación

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd localspark
```

### 2. Instalar dependencias (Windows)
Si encuentras el error de `@rollup/rollup-win32-x64-msvc`, sigue estos pasos:

```bash
# Eliminar archivos existentes
rm -rf node_modules package-lock.json
# O en Windows Command Prompt:
# rmdir /s node_modules
# del package-lock.json

# Limpiar caché de npm
npm cache clean --force

# Reinstalar dependencias
npm install

# Si el error persiste, instalar Rollup específicamente
npm install @rollup/rollup-win32-x64-msvc --save-dev

# Luego reinstalar todas las dependencias
npm install
```

### 3. Configurar Ollama

#### Iniciar Ollama
```bash
ollama serve
```

#### Descargar al menos un modelo
```bash
# Modelos recomendados (elige uno o varios):
ollama pull llama2          # Modelo general (3.8GB)
ollama pull codellama       # Especializado en código (3.8GB)
ollama pull mistral         # Modelo rápido y eficiente (4.1GB)
ollama pull phi3           # Modelo pequeño y rápido (2.3GB)

# Para verificar modelos instalados:
ollama list
```

#### Configurar CORS (Necesario para la aplicación web)
```bash
# Detener Ollama si está ejecutándose
# En Windows: Ctrl+C en la terminal donde corre ollama serve

# Configurar variable de entorno para permitir origen local
set OLLAMA_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Reiniciar Ollama con la configuración
ollama serve
```

**En Linux/Mac:**
```bash
export OLLAMA_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
ollama serve
```

## Ejecutar la aplicación

### 1. Iniciar el servidor de desarrollo
```bash
npm run dev
```

### 2. Abrir en el navegador
La aplicación estará disponible en: http://localhost:5173

## Verificación de la instalación

### 1. Verificar que Ollama esté ejecutándose
```bash
# En otra terminal:
curl http://localhost:11434/api/tags
```
Debería devolver una lista de modelos instalados.

### 2. Verificar la aplicación
1. Abrir http://localhost:5173
2. El selector de modelos debería mostrar los modelos disponibles
3. El indicador de conexión debería estar verde

## Solución de problemas comunes

### Error de módulo Rollup en Windows
```bash
# Solución completa:
rm -rf node_modules package-lock.json
npm cache clean --force
npm install @rollup/rollup-win32-x64-msvc --save-dev
npm install
```

### Ollama no conecta
1. Verificar que Ollama esté ejecutándose: `ollama list`
2. Verificar CORS: Asegúrate de configurar `OLLAMA_ORIGINS`
3. Reiniciar Ollama después de configurar CORS

### Modelos no aparecen
1. Verificar modelos instalados: `ollama list`
2. Descargar al menos un modelo: `ollama pull llama2`
3. Refrescar la página

### Puerto ocupado
Si el puerto 5173 está ocupado:
```bash
# Usar un puerto diferente
npm run dev -- --port 3000
# Y actualizar OLLAMA_ORIGINS:
set OLLAMA_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## Uso de la aplicación

### 1. Subir archivos de proyecto
- Usa la barra lateral izquierda para cargar archivos
- Los archivos proporcionan contexto al AI
- Soporta archivos de código, texto, JSON, etc.

### 2. Seleccionar modelo
- Usa el selector en la parte superior
- Los modelos disponibles aparecen automáticamente
- Recomendado: `codellama` para código, `llama2` para uso general

### 3. Chatear con el AI
- Escribe tu pregunta en el campo de texto inferior
- El AI responde usando el contexto de los archivos subidos
- El historial se guarda automáticamente

## Modelos recomendados por uso

### Para desarrollo de código:
- `codellama` - Especializado en programación
- `deepseek-coder` - Excelente para tareas de código

### Para uso general:
- `llama2` - Balanceado y confiable
- `mistral` - Rápido y eficiente

### Para recursos limitados:
- `phi3` - Pequeño pero capaz
- `llama2:7b` - Versión más pequeña de Llama2

## Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de build
npm run lint         # Verificar código
```

## Estructura del proyecto

```
localspark/
├── src/
│   ├── components/     # Componentes React
│   ├── lib/           # Utilidades y APIs
│   ├── assets/        # Recursos estáticos
│   └── App.tsx        # Componente principal
├── public/            # Archivos públicos
└── package.json       # Dependencias del proyecto
```

## Contribuir

1. Fork el repositorio
2. Crear una rama: `git checkout -b feature/nueva-caracteristica`
3. Commit cambios: `git commit -am 'Agregar nueva característica'`
4. Push a la rama: `git push origin feature/nueva-caracteristica`
5. Crear Pull Request

## Soporte

Si encuentras problemas:
1. Revisa esta guía de solución de problemas
2. Verifica que Ollama esté ejecutándose correctamente
3. Comprueba los logs en la consola del navegador
4. Abre un issue en el repositorio con detalles del error