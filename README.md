# 🌸 Narime

Narime es una aplicación web para el seguimiento y descubrimiento de anime. Permite a los usuarios gestionar su lista personal, obtener recomendaciones personalizadas, explorar contenido con filtros avanzados y consultar estadísticas de su historial.

El proyecto está inspirado en MyAnimeList, con una arquitectura moderna basada en React + Firebase + API REST.

Live demo: https://narime-ffffd.web.app/

## ✨ Features

### Autenticación
- Registro con email y contraseña
- Login con Google OAuth
- Rutas protegidas y públicas
- Persistencia de sesión

### Directorio
- Top anime, Trending, Seasonal y Upcoming
- Tab "Para ti" con recomendaciones personalizadas basadas en el historial del usuario
- Paginación infinita

### Discover
- Búsqueda avanzada con filtros por género, tipo, estado, score y orden
- Resultados dinámicos desde la API

### Mi Lista
- Añadir anime con estado, score personal y episodios vistos
- Filtrar por estado (watching, completed, dropped, plan to watch)
- Ordenar por estado, alfabético, score o episodios vistos
- Buscador integrado
- Barra de progreso por anime

### Perfil de usuario
- Estadísticas: episodios vistos, tiempo invertido, score medio y distribución por estado con gráfico donut
- Anime favoritos (hasta 5)
- Edición de nombre de usuario y biografía

### Búsqueda
- Búsqueda por título con debounce
- Preview de resultados en tiempo real
- Página de resultados con paginación

### Página de detalle
- Información completa del anime
- Personajes y actores de doblaje
- Trailer de YouTube
- Migas de pan con historial de navegación


## 🧰 Tecnologías usadas

### Frontend
- React + TypeScript
- React Router
- TanStack React Query (caché, estados de carga, paginación infinita)
- React Hook Form
- SCSS con BEM
- Axios

### Backend / Servicios
- Firebase Authentication
- Cloud Firestore
- Jikan REST API (MyAnimeList)

### UI / UX
- Sonner (toasts)
- CSS `conic-gradient` para gráficos

## 📦 Instalación

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/holiwiiss/narime.git
cd narime
npm install
```
### Variables de entorno

Este proyecto usa Firebase, por lo que necesitas crear un archivo .env en la raíz del proyecto con tus credenciales de Firebase.

### Ejecutar el proyecto

```bash
npm run dev
```
La app se ejecutará en: http://localhost:5173