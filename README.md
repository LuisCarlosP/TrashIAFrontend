# TrashIA Frontend

Frontend desarrollado con React + TypeScript + Vite para el sistema de clasificación inteligente de residuos TrashIA.

## 🌟 Características

- **Upload de Imágenes**: Selecciona imágenes desde tu dispositivo
- **Captura de Fotos**: Toma fotos directamente con la cámara
- **Clasificación IA**: Identifica 6 tipos de residuos (cartón, vidrio, metal, papel, plástico, basura)
- **Información de Reciclabilidad**: Indica si el material es reciclable
- **Diseño Responsivo**: Funciona en móviles, tablets y desktop
- **Tema Verde Ecológico**: Diseño moderno con paleta de colores verde

## 🚀 Tecnologías

- React 18
- TypeScript
- Vite
- CSS3 (Gradientes y animaciones)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Para desarrollo local, crea un archivo .env.local
cp .env.example .env.local

# Editar .env.local con la URL de tu backend local
# VITE_API_URL=http://localhost:8000

# El archivo .env tiene la URL de producción
# VITE_API_URL=https://trashia.onrender.com
```

## 🏃‍♂️ Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🏗️ Build

```bash
# Generar build de producción
npm run build

# Preview del build
npm run preview
```

## 🔗 Backend

Este frontend se conecta al backend de TrashIA. Asegúrate de tener el backend corriendo en el puerto especificado en `.env`

Backend repository: `TrashIA/ModeloIATrashNet`

## 📱 Funcionalidades

### Seleccionar Imagen
1. Click en "Seleccionar Imagen"
2. Elige una foto de tu dispositivo
3. Espera la clasificación

### Tomar Foto
1. Click en "Tomar Foto"
2. Permite acceso a la cámara
3. Click en "Capturar"
4. Espera la clasificación

### Resultado
- **Tipo de Material**: Clasificación del residuo
- **Confianza**: Porcentaje de certeza de la IA
- **Reciclabilidad**: Indica si es reciclable
- **Información**: Consejos sobre cómo reciclar

## 🎨 Tema de Colores

- Verde Principal: `#2e7d32`
- Verde Secundario: `#388e3c`
- Verde Claro: `#43a047`
- Fondo: Gradiente verde claro

## 📄 Licencia

MIT

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
