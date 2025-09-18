# Ollama Spark - Instalación y Configuración

Una interfaz local para interactuar con modelos de Ollama, inspirada en GitHub Spark.

   - Verificar in

   - Verificar instalación: `ollama --
## Instalación
   - Verificar instalación: `node --version`

2. **Ollama** instalado y ejecutándose
   - Descargar desde: https://ollama.ai/download
   - Verificar instalación: `ollama --version`

## Instalación


```bash
git clone <URL_DEL_REPOSITORIO>
cd localspark
# d

npm cache clean --force
Si encuentras el error de `@rollup/rollup-win32-x64-msvc`, sigue estos pasos:

```bash
# Eliminar archivos existentes
rm -rf node_modules package-lock.json
# O en Windows Command Prompt:
# rmdir /s node_modules
# del package-lock.json

#### Configurar CORS (
# Detener Ollama si est

set OLLAMA_ORIGINS=http:/
# Reiniciar

**En Linux/Mac:**
export OLLAMA_ORIGINS=http://localhost:5173,http://1

## Ejecutar la aplicación
### 1. Inic
npm

La aplicación estará dis

### 1. Verificar qu
# En ot
```


3. El indicador de conexión deber
## Solu
### Error de módulo Rollup en Windows
# Solución completa:
npm cache clean --force
npm install


3. Reiniciar Ollama después de confi
### Modelos
2. 

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











































































