# 🌸 Narime

Narime es una plataforma de seguimiento de anime que permite a los usuarios gestionar su progreso, organizar sus listas personales y descubrir nuevo contenido de forma intuitiva.

El proyecto está inspirado en **MyAnimeList**, con el objetivo de ofrecer una experiencia más moderna, limpia y centrada en el usuario.

Actualmente el proyecto se encuentra en fase temprana (MVP) con autenticación implementada.

## ✨ Estado del proyecto

Actualmente incluye:

- Registro de usuarios con email y contraseña
- Login con Google
- Sistema de rutas base
- Estructura inicial del directorio
- Guía de estilos (Style Guide)

## 🧰 Tecnologías usadas

### Frontend
- React
- TypeScript
- React Router
- React Hook Form
- SCSS

### Backend / Servicios
- Firebase Authentication

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

Este proyecto usa Firebase, por lo que necesitas crear un archivo .env en la raíz del proyecto.

### Ejecutar el proyecto

```bash
npm run dev
```
La app se ejecutará en: http://localhost:5173

#### Rutas disponibles
 -http://localhost:5173/login: incio de sesion

 -http://localhost:5173/register: Registro de usuario

 -http://localhost:5173/directory: pruebas de llamada a la API JIKAN Anime
 
 -http://localhost:5173/style-guide: guia de estilos