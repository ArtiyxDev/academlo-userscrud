# Academlo Users CRUD

Una aplicación moderna de gestión de usuarios construida con React, TypeScript y Vite, conectada a la API REST [academlo-usersapi](https://github.com/ArtiyxDev/academlo-usersapi).

## 🚀 Características

- ✅ Interfaz completa de CRUD para usuarios
- ✅ Conexión 100% a API REST real (academlo-usersapi)
- ✅ **Sin localStorage** - Persistencia real en base de datos
- ✅ Modo oscuro/claro (preferencia guardada localmente)
- ✅ Búsqueda y filtrado de usuarios en tiempo real
- ✅ Paginación dinámica
- ✅ Validación de formularios con React Hook Form
- ✅ TypeScript para tipado seguro
- ✅ Diseño responsive con TailwindCSS
- ✅ Manejo centralizado de errores

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener:

- **Node.js** (v18 o superior)
- **pnpm** (gestor de paquetes)
- **API Backend**: Debes tener corriendo la [academlo-usersapi](https://github.com/ArtiyxDev/academlo-usersapi) en `http://localhost:3000`

> ⚠️ **Importante**: Esta aplicación **requiere** que la API esté corriendo. No hay datos de prueba locales ni modo offline. Todos los datos se persisten en PostgreSQL a través de la API.

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ArtiyxDev/academlo-userscrud.git
cd academlo-userscrud
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita el archivo `.env` si necesitas cambiar la URL de la API:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 4. Asegúrate de que la API esté corriendo

Sigue las instrucciones en [academlo-usersapi](https://github.com/ArtiyxDev/academlo-usersapi) para levantar el backend.

### 5. Ejecutar la aplicación

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
academlo-userscrud/
├── src/
│   ├── components/           # Componentes React (PascalCase)
│   │   ├── Card.tsx          # Componente de tarjeta genérica
│   │   ├── Dialog.tsx        # Componente de diálogo modal
│   │   ├── Header.tsx        # Encabezado de la aplicación
│   │   ├── SearchBar.tsx     # Barra de búsqueda
│   │   ├── TablePager.tsx    # Paginador de tabla
│   │   ├── UserCard.tsx      # Tarjeta individual de usuario
│   │   ├── UserDialog.tsx    # Diálogo para crear/editar usuarios
│   │   ├── UsersTable.tsx    # Tabla/grid de usuarios
│   │   └── index.ts          # Exports centralizados
│   ├── hooks/                # Custom React Hooks (camelCase)
│   │   └── useUsersApi.ts    # Hook principal para API REST
│   ├── types/                # Definiciones de tipos TypeScript
│   │   └── api.ts            # Tipos para API y modelos
│   ├── utils/                # Funciones utilitarias
│   │   └── toggleDarkTheme.ts # Utilidad para modo oscuro
│   ├── App.tsx               # Componente principal de la app
│   ├── App.css               # Estilos del componente App
│   ├── main.tsx              # Punto de entrada de React
│   └── index.css             # Estilos globales
├── public/
│   └── api/
│       └── users.json        # Datos mock (no usados con API real)
├── .env                      # Variables de entorno (no commitear)
├── .env.example              # Ejemplo de configuración
├── package.json              # Dependencias y scripts
├── tsconfig.json             # Configuración de TypeScript
├── vite.config.ts            # Configuración de Vite
└── README.md                 # Este archivo
```

## 📐 Convenciones de Nomenclatura

Este proyecto sigue las siguientes convenciones:

- **Componentes React**: `PascalCase` (ej: `UserCard.tsx`, `Dialog.tsx`)
- **Hooks personalizados**: `camelCase` con prefijo `use` (ej: `useUsersApi.ts`)
- **Archivos de utilidades**: `camelCase` (ej: `toggleDarkTheme.ts`)
- **Tipos e interfaces**: `PascalCase` (ej: `JsonUser`, `UseUsersApiReturn`)
- **Archivos de estilos**: `kebab-case` o igual que componente (ej: `App.css`)
- **Carpetas**: `camelCase` o `kebab-case` (ej: `components/`, `hooks/`)
- **Variables de entorno**: `SCREAMING_SNAKE_CASE` con prefijo `VITE_` (ej: `VITE_API_URL`)

## 🎣 Hooks Personalizados

### `useUsersApi`

Hook personalizado que maneja todas las operaciones CRUD con la API REST real.

**Ubicación**: `src/hooks/useUsersApi.ts`

**Características**:

- ✅ Conexión directa a `academlo-usersapi`
- ✅ Gestión automática de estados (loading, error)
- ✅ Manejo centralizado de errores con Axios
- ✅ Validación de datos antes de enviar
- ✅ **Sin uso de localStorage** - 100% API REST

**Métodos disponibles**:

```typescript
const {
  users, // Array de usuarios
  loading, // Estado de carga
  error, // Mensaje de error (si hay)
  getUsers, // Obtener todos los usuarios
  createUser, // Crear nuevo usuario
  updateUser, // Actualizar usuario existente
  deleteUser, // Eliminar usuario
  refreshUsers, // Refrescar lista de usuarios
} = useUsersApi();
```

**Ejemplo de uso**:

```typescript
import useUsersApi from "./hooks/useUsersApi";

function App() {
  const { users, loading, error, createUser, deleteUser } = useUsersApi();

  const handleAddUser = async (userData) => {
    try {
      await createUser(userData);
      console.log("Usuario creado exitosamente");
    } catch (err) {
      console.error("Error al crear usuario:", err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

## 🔌 Integración con la API

Este proyecto se conecta **exclusivamente** a la [academlo-usersapi](https://github.com/ArtiyxDev/academlo-usersapi) para todas las operaciones de datos.

### ⚠️ Importante sobre Persistencia

- ❌ **NO usa localStorage** para guardar usuarios
- ✅ **SÍ usa API REST** - Todos los cambios se guardan en PostgreSQL
- ✅ Los datos persisten entre sesiones y navegadores
- ✅ Soporte para múltiples usuarios simultáneos
- 📝 Único uso de localStorage: preferencia de tema (oscuro/claro)

### API Endpoints

### Endpoints Utilizados

- `GET /api/v1/users` - Obtener todos los usuarios
- `POST /api/v1/users` - Crear un nuevo usuario
- `PUT /api/v1/users/:id` - Actualizar un usuario
- `DELETE /api/v1/users/:id` - Eliminar un usuario

### Modelo de Usuario

```typescript
interface JsonUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // No se devuelve en las respuestas
  birthday: string; // Formato: YYYY-MM-DD
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

## 🧩 Componentes Principales

### Componentes UI Genéricos

- **`Card`**: Contenedor con estilos base para tarjetas
- **`Dialog`**: Modal reutilizable con overlay
- **`Header`**: Encabezado con título y toggle de tema oscuro/claro

### Componentes de Usuario

- **`UserCard`**: Tarjeta individual que muestra info de un usuario
- **`UserDialog`**: Formulario modal para crear/editar usuarios
- **`UsersTable`**: Grid responsivo que muestra lista de usuarios

### Componentes de Navegación

- **`SearchBar`**: Barra de búsqueda con filtrado en tiempo real
- **`TablePager`**: Paginador con controles y selector de items por página

## 📝 Scripts Disponibles

- `pnpm dev` - Inicia el servidor de desarrollo con hot reload
- `pnpm build` - Construye la aplicación optimizada para producción
- `pnpm preview` - Previsualiza la build de producción localmente
- `pnpm lint` - Ejecuta ESLint para verificar calidad del código

## 🎨 Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Build tool y dev server ultrarrápido
- **TailwindCSS** - Framework de CSS utilitario
- **Axios** - Cliente HTTP para peticiones a la API
- **React Hook Form** - Manejo de formularios
- **React Icons** - Iconos
- **pnpm** - Gestor de paquetes eficiente

## 🔧 Configuración de la API

Para cambiar la URL de la API, edita el archivo `.env`:

```env
# URL por defecto (desarrollo local)
VITE_API_URL=http://localhost:3000/api/v1

# Ejemplo para producción
# VITE_API_URL=https://tu-api.com/api/v1
```

## 🤝 Contribución

¿Quieres contribuir al proyecto? Lee nuestra documentación:

- **[Guía de Contribución](CONTRIBUTING.md)** - Convenciones, estructura y mejores prácticas
- **[Arquitectura Técnica](ARCHITECTURE.md)** - Decisiones de diseño y flujo de datos

### Documentos Importantes

- Convenciones de nomenclatura
- Estructura de código
- Mejores prácticas
- Estándares de commits
- Flujo de persistencia de datos
- Por qué NO usamos localStorage para usuarios

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia que especifiques.

## 👨‍💻 Autor

Proyecto desarrollado para Academlo.

## 📖 React + TypeScript + Vite

Este proyecto está basado en el template de Vite con React y TypeScript, que proporciona:

- HMR (Hot Module Replacement) para desarrollo rápido
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) - Usa Babel para Fast Refresh
- Reglas de ESLint configuradas

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
