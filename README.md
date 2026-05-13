# 🌸 Narime

Narime es una aplicación web full-stack para el seguimiento de anime que permite a los usuarios buscar contenido, gestionar su progreso y persistir sus listas personales en la nube.

El proyecto está inspirado en MyAnimeList, con una arquitectura moderna basada en React + Firebase + API REST y desplegado en Netlify.

Live demo: https://narime-mvp.netlify.app/

## ✨ Features actuales (MVP avanzado)

### Autenticación
- Registro con email y contraseña
- Login con Google OAuth
- Persistencia de sesión

### Integración con Anime API
- Consumo de Jikan REST API
- Llamadas HTTP con Axios
- Gestión de estados de carga y errores
- Vista de listado de anime dinámica.

### Gestión de listas de usuarios

Los usuarios autenticados pueden:
- Guardar anime en su colección personal
- Marcar estado como: watching, completed, dropped o plan to watch
- Persistencia en Cloud Firestore
- Sincronización automática por usuario

## 🧰 Tecnologías usadas

### Frontend
- React
- TypeScript
- React Router
- React Hook Form
- SCSS
- Axios

### Backend / Servicios
- Firebase Authentication
- API pública JikanApi 
- Cloud Firestore

### UI / UX
- Sileo (notificaciones toast)

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