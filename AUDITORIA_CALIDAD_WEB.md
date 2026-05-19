# Auditoría de Calidad Web — Narime (v2)

> **Proyecto:** Narime · **Estudiante:** Paula
> **Fecha:** 19 de mayo de 2026 · **Rama:** `main` · **Commit:** `a002ba8`
> **URL auditada:** `http://localhost:5173/`
> **Enfoque:** HTML · CSS · Performance
> **Auditoría anterior:** la primera versión hablaba de 25 `<h1>` en el directorio, CLS 0.23 y 5 vulnerabilidades npm. **Has arreglado las tres cosas.** Esta v2 se centra en lo que queda y en las decisiones nuevas que ha introducido el refactor.

---

## 🎯 Antes de empezar: cuánto has crecido desde la última auditoría

Han pasado 48 commits desde el último reporte. No es una exageración decir que has cambiado la arquitectura del proyecto. Quiero que veas el salto antes de meternos en lo que se puede pulir:

1. **Has corregido la jerarquía de headings.** En la Directory v1 había 25 `<h1>` por página. Ahora medido en DevTools: **0 `<h1>` en el directorio**, las tarjetas usan `<h2>`. Eso te ha bajado un nivel entero de penalización de a11y.
2. **Has matado el CLS.** De 0.23 (zona "mejorable") a **0.00** (perfecto). Cambiar las portadas de `<img>` a `background-image` en `AnimeCard` ha sido la decisión que ha hecho ese trabajo — porque los `background-image` no provocan reflow al cargar. Si lo hiciste a propósito, es buena ingeniería; si fue suerte, ya sabes el porqué.
3. **`@tanstack/react-query` integrado** (`useQuery` en `MyListPage`, `AnimePage`, hooks de directorio y búsqueda). Has pasado de gestionar estado de fetch a mano con `useState + useEffect` a una librería estándar con cache, refetch automático, `staleTime` configurable. Esto es lo que se usa en producción real.
4. **Hooks personalizados.** `useDirectoryAnimes`, `useSearchAnimes`, `useMyListMap`, `useAnimeModal`, `useAuthForms`. Has reconocido lógica repetida y la has extraído. `useMyListMap` con el `Map` para lookup O(1) es **una decisión de rendimiento real**, no decorativa.
5. **Contextos bien separados.** `AuthProvider` y `MyListProvider`, anidados desde `main.tsx`. Y `ProtectedRoute` para `/my-list`. Esto es arquitectura de aplicación real.
6. **`React.memo(AnimeCard)`** — tu propio comentario en el código dice *"hace que no se vuelva a renderizar la carta si sus propiedades no han cambiado"*. Conoces lo que hace y por qué. Eso vale mucho más que copiarlo de Stack Overflow.
7. **`useMemo` para listas ordenadas y filtradas en `MyListPage`.** Has identificado qué cálculos no deben rehacerse en cada render.
8. **Sistema de tabs reutilizable** (`_tabNavigation.scss`) con animación de la línea inferior usando `::after` y transición CSS. Es un patrón profesional, y lo has hecho sin tocar JS.
9. **`backdrop-filter: blur(6px)`** en el modal, con prefijo `-webkit-backdrop-filter` para Safari. Detalle de compatibilidad que la mayoría olvida.
10. **`data-status` atributo en los badges**, con selectores `[data-status="completed"]` en SCSS. Esto es el patrón correcto: tu HTML expone estado semántico, tu CSS estiliza basándose en ese estado. Mejor que `className={status === "completed" ? "..." : "..."}`.
11. **Loader hecho desde cero** con `@keyframes spin`. Bonito, sin dependencia externa, y con un kaomoji que da personalidad.
12. **`object-fit: cover` + `object-position: center`** en el header de AnimePage. Es como hace una imagen "lo que debe" dentro de un contenedor flex sin distorsionarse.
13. **`axios` extraído a `apiAxios.ts`.** Una instancia central de cliente HTTP. Cuando quieras añadir interceptores (refresh tokens, retry, logging), tendrás un único sitio.
14. **`Vitest` configurado.** No tienes muchos tests aún, pero el setup está listo. Eso ya separa tu proyecto del 90% de proyectos de bootcamp.
15. **Vulnerabilidades npm: de 5 (incluyendo 1 crítica) a 1 moderada.** Has actualizado dependencias. Importante.

Con esa base, la auditoría de hoy es muy diferente. Lo de la v1 era "te falta lo básico". Esta v2 es "casi todo está, vamos a pulir los detalles que separan tu proyecto de uno listo para producción".

---

## 📊 Scores y métricas vs la auditoría anterior

| Métrica | v1 (22 abr) | v2 (19 may) | Cambio |
|---|---|---|---|
| Lighthouse Accesibilidad | 81 | **81** | = |
| Lighthouse Best Practices | 77 | **77** | = |
| Lighthouse SEO | 75 | **75** | = |
| **Core Web Vital · LCP** | 240 ms ✅ | **210 ms ✅** | ⬇️ -30 ms |
| **Core Web Vital · CLS** | 0.23 ⚠️ | **0.00 ✅** | ⬇️ **-0.23** |
| Vulnerabilidades npm | 5 (1 critical) | **1 (moderate)** | ⬇️ -4 |
| Bundle JS (gzipped) | 184 kB | **287 kB** | ⬆️ +103 kB |
| Vulns que rompen | 1 | 0 | ⬇️ |

Los scores numéricos de Lighthouse están **iguales** porque los audits fallidos (image-alt, contrast, meta-description, landmark, lang) **son exactamente los mismos que en v1**. Es decir: el refactor ha sido enorme pero los puntos pendientes son los mismos del primer reporte. Esta v2 explica cuáles siguen abiertos y cuáles han aparecido nuevos por las features añadidas.

El bundle ha crecido 100 kB gzipped — esperado, has añadido `axios`, `react-query`, hooks, contextos, modal. Es el precio normal. Lo veremos al final.

---

## 🧭 Cómo leer este documento

Cada sección sigue el mismo formato que la v1: *qué pasa · por qué importa · cómo lo arreglas · 💡 aprendizaje*. He marcado con 🔄 las que vienen del reporte anterior y aún no se han abordado, y con 🆕 las nuevas que han aparecido con el refactor.

He ordenado por **valor didáctico**, no por severidad. La primera sección es un bug real que va antes que cualquier auditoría — porque rompe carga.

---

## 1. 🆕 `UserPage` crashea cuando no hay sesión

### Qué pasa

`src/view/userPage/UserPage.tsx:28-29`:

```tsx
const UserPage = () => {
  const { user } = useAuth()
  const [userData, setUserData] = useState<any>(null)
  // ... useEffect que solo asigna userData si user existe

  return <>
    <h1>{userData.username}</h1>          {/* ← null.username */}
    <img className="user__image" src={userData.avatar} alt="" />
  </>;
};
```

Si entras en `/user-page` sin estar logueada (o antes de que cargue Firebase), `userData` vale `null` y la línea 28 hace `null.username` → **runtime error**, React Router lo captura con su `ErrorBoundary` por defecto y muestra pantalla en blanco con error en consola.

Lo he reproducido entrando en `http://localhost:5173/user-page` sin sesión:

```
TypeError: Cannot read properties of null (reading 'username')
The above error occurred in the <UserPage> component.
```

### Por qué importa

- **La pantalla queda en blanco**, sin mensaje útil para la usuaria. Si alguien copia una URL de su perfil y la abre en otra pestaña antes de que cargue el contexto de auth, ve eso.
- La ruta `/user-page` **no está protegida** (a diferencia de `/my-list` que sí usa `ProtectedRoute`). Cualquier link incluso desde fuera la rompe.
- Es un patrón de bug muy común en React + datos asíncronos. La lección vale más que el fix.

### Cómo lo arreglas

Dos cosas en orden:

**1. Renderizado condicional al inicio del return.** Nunca asumas que un estado asíncrono ya tiene valor:

```tsx
const UserPage = () => {
  const { user } = useAuth()
  const [userData, setUserData] = useState<UserDataType | null>(null)

  useEffect(() => {
    if (!user) return
    const fetchUser = async () => {
      const data = await getUserInformation(user.uid);
      if (data) setUserData(data);
    };
    fetchUser();
  }, [user]);

  if (!user) return <Navigate to="/login" replace />
  if (!userData) return <LoadingComponent text="Cargando perfil..." />

  return (
    <main>
      <h1>{userData.username}</h1>
      <img className="user__image" src={userData.avatar} alt={`Avatar de ${userData.username}`} />
    </main>
  );
};
```

**2. Envolver `/user-page` en `ProtectedRoute`** igual que hiciste con `/my-list`:

```tsx
// main.tsx
{
  path: '/user-page',
  element: <ProtectedRoute><UserPage/></ProtectedRoute>
}
```

Y de paso, **el `<any>` en `useState<any>(null)`** quítatelo. Tienes los tipos en `firestoreService.type.ts` — úsalos. Cuando esté tipado, TypeScript te habría avisado de que `userData` puede ser `null` y este bug **no existiría**.

```tsx
const [userData, setUserData] = useState<UserFirestoreType | null>(null)
```

### 💡 Aprendizaje

**Cualquier `useState(null)` que luego se usa sin guard es una bomba de tiempo.** Hay tres reglas mentales para datos asíncronos:

1. **Tipa el estado** — incluir `null` o `undefined` en el tipo te obliga a comprobarlo.
2. **Comprueba antes de renderizar** — si no hay dato, devuelve un placeholder (loading, error, vacío) **antes** del return principal.
3. **Protege las rutas** que dependan de auth — el `ProtectedRoute` que ya tienes funciona para todas, no solo `/my-list`.

---

## 2. 🔄 El `<head>` sigue sin tocar (esto era la sección 1 + 2 de v1)

### Qué pasa

`index.html` está **idéntico** a v1:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>narime</title>
  </head>
```

- `lang="en"` cuando la app es en español ("Registro", "Contraseña", "Aquí tienes los resultados de tu búsqueda", "Cargando animes...", "Cerrar sesion").
- Sin `meta description`.
- `<title>narime</title>` en minúscula, sin descriptor.
- Favicon todavía el de Vite (`/vite.svg`).

Lighthouse marca 3 audits fallidos por esto: `meta-description`, `robots-txt` no válido (porque no hay), `llms-txt` (nuevo audit de Lighthouse 12). El `lang` no llega a Lighthouse pero sí pesa para lectores de pantalla.

### Por qué importa

Repito de v1 porque sigue aplicando:

- **Compartir el enlace por WhatsApp/Discord** sale como `narime - narime` sin imagen ni descripción → cero conversión.
- **Lectores de pantalla** pronuncian "Contraseña" como si fuera inglés.
- **El favicon de Vite** es un "huelo a proyecto recién hecho de bootcamp" muy potente.

### Cómo lo arreglas

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Narime · Tu directorio personal de anime</title>
    <meta name="description" content="Descubre, puntúa y gestiona tus animes favoritos. Listas personales, rankings y temporadas en un solo sitio." />
    <meta name="theme-color" content="#B11226" />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <meta property="og:title" content="Narime · Tu directorio de anime" />
    <meta property="og:description" content="Descubre, puntúa y organiza tu anime favorito." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/og-image.png" />

    <meta name="twitter:card" content="summary_large_image" />
  </head>
  ...
</html>
```

Para el favicon, puedes hacer uno rápido en [favicon.io](https://favicon.io/favicon-generator/) con la letra N sobre fondo `#B11226`. Te tarda 90 segundos.

### 💡 Aprendizaje

**Un `<head>` rellenado es el cambio de menor esfuerzo y mayor impacto que existe.** Te lleva 5 minutos y mejora SEO, redes sociales, accesibilidad e identidad de marca a la vez. No hay otro cambio en toda la web con ese ratio. Si hay UNA cosa de la auditoría que hagas hoy, que sea esta.

---

## 3. 🆕 La tarjeta de anime ha dejado de ser un `<div>` clickable, ahora es un `<article>` clickable — pero el problema sigue siendo el mismo

### Qué pasa

En `AnimeCard.tsx:23` la tarjeta es:

```tsx
<article className="anime-card"
         style={{ backgroundImage: `url(${anime.image})` }}
         onClick={() => navigate(`/anime/${anime.id}`)}>
  <header>...</header>
  <footer>...</footer>
</article>
```

Has cambiado `<div>` por `<article>` — mejor semántica, sí. Y el contenido interno (`<header>`, `<footer>`) es ejemplar. Pero **el `onClick` sigue rompiendo accesibilidad por teclado**: un `<article>` no es focusable, no responde a Enter/Space, no se anuncia como interactivo en NVDA/VoiceOver.

Además, has introducido un patrón nuevo: dentro de la tarjeta hay un botón "Add/Edit" con `e.stopPropagation()`:

```tsx
<button onClick={(e) => { e.stopPropagation(); onOpenModal(anime.id) }}>...</button>
```

Esto resuelve el conflicto de clicks dentro de un contenedor clickable, pero es una pista de que **estás luchando contra el HTML**: tienes un "contenedor que navega" con "botones que no deben navegar". Eso es un síntoma típico de que la jerarquía está al revés.

### Por qué importa

- Tab teclado: pulsas `Tab` y la tarjeta no se selecciona. Solo te lleva al botón "Add". Para ir al detalle del anime un usuario sin ratón **no tiene forma**.
- Lectores de pantalla: dicen "*artículo, gráfico, Frieren, watching, 12 / 28 episodes, botón Edit*" pero **no anuncian que hay un link**. La usuaria no sabe que puede entrar.
- Ctrl+clic / botón central del ratón: no abre en pestaña nueva. En catálogos esto se usa muchísimo.

### Cómo lo arreglas

Invertir la jerarquía: el "destino" es la página del anime → el `<article>` debe ser un `<Link>`. Y el botón Add/Edit se posiciona absoluto encima:

```tsx
<div className="anime-card-wrapper">
  <Link
    to={`/anime/${anime.id}`}
    className="anime-card"
    style={{ backgroundImage: `url(${anime.image})` }}
    aria-label={`Ver detalles de ${anime.title}`}
  >
    <header className="anime-card__header">
      <div className="anime-card__score">
        {/* el icono va luego — ver sección 5 */}
        <span aria-hidden="true">★</span>
        <p>{anime.score ?? "N/A"}</p>
      </div>
      {userData && (<span data-status={userData.statusPersonal}>{userData.statusPersonal}</span>)}
    </header>

    <footer className="anime-card__footer">
      <div className="anime-card__info">
        <p>{userData ? `${userData.episodesWatched} / ${anime.episodes} episodes` : `${anime.episodes} episodes`}</p>
        <h2 className="anime-card__title">{anime.title}</h2>
      </div>
    </footer>
  </Link>

  {/* Botón Add/Edit FUERA del Link */}
  <button
    type="button"
    className={`btn btn--small anime-card__button ${userData ? "btn--secondary" : ""}`}
    onClick={() => onOpenModal(anime.id)}
    aria-label={userData ? `Editar ${anime.title} en mi lista` : `Añadir ${anime.title} a mi lista`}
  >
    {userData ? "Edit" : "Add"}
  </button>

  <p className="anime-card__meta">{anime.type} | {anime.year ?? "N/A"}</p>
</div>
```

En CSS posicionas el botón absoluto sobre la tarjeta:

```scss
.anime-card-wrapper {
  position: relative;
}
.anime-card__button {
  position: absolute;
  bottom: var(--space-s);
  right: var(--space-s);
  z-index: 2;
}
```

El `stopPropagation` desaparece porque ya no hay solapamiento de eventos — el botón no está dentro del link, está al lado.

Si te suena raro porque el `Link` es "todo el área de la tarjeta", piénsalo así: en cualquier marketplace (Amazon, MercadoLibre, Vinted) las tarjetas son links con botones absolutos encima. Es **el patrón estándar**.

### 💡 Aprendizaje

**Cuando te encuentras escribiendo `e.stopPropagation()`, párate.** Casi siempre indica que dos elementos interactivos están anidados cuando no deberían. La solución no es "tapar el evento" — es **rediseñar la jerarquía** para que cada elemento haga lo suyo sin solapar. Si el contenedor "navega" y el botón "abre un modal", uno de los dos no debería estar dentro del otro.

---

## 4. 🔄 Los `<label>` siguen sin `htmlFor` (sección 5 de v1)

### Qué pasa

Te aviso porque DevTools sigue mostrando en consola:

> `[issue] A form field element should have an id or name attribute`

En `LoginPage.tsx`, `RegisterPage.tsx`, `ModalAddEditAnime.tsx`, todos los `<label>` siguen así:

```tsx
<label>Email</label>
<input type="email" {...register('email')} />
```

Y has añadido formularios nuevos (el modal Add/Edit) que repiten exactamente el mismo patrón:

```tsx
// ModalAddEditAnime.tsx:97
<label>Status</label>
<select {...register("status")}>...</select>

<label>Score</label>
<input type="number" {...register('score', ...)} />

<label>Episodes</label>
<input type="number" {...register('episodes', ...)} />
```

### Por qué importa

Igual que en v1: hacer clic en el texto del label **no enfoca el input**. En el modal (que es pequeño y central) esa pérdida es especialmente notable. Y con `react-hook-form` es trivial de arreglar.

### Cómo lo arreglas

Patrón general — envolver:

```tsx
<label>
  Email
  <input type="email" {...register('email', { required: 'Obligatorio' })} />
</label>
```

O con `htmlFor` + `id`. Si vas a tener el mismo formulario en dos sitios (login y modal), pasa el `id` como prop para que no colisione:

```tsx
<label htmlFor="login-email">Email</label>
<input id="login-email" type="email" {...register('email', ...)} />
```

Para el modal:

```tsx
<label htmlFor="modal-status">Status</label>
<select id="modal-status" {...register("status")}>...</select>
```

### 💡 Aprendizaje

**Si DevTools te muestra un issue en consola y lo ignoras, está en tu código.** No es ruido. La barra de Issues de Chrome es uno de los mejores indicadores de calidad técnica en tiempo real — es básicamente Lighthouse continuo. Cuando aparezca un issue, lee el mensaje, mira el elemento que apunta, y corrige antes de añadir nueva funcionalidad.

---

## 5. 🆕 Bordes rojos de placeholder por todo el SCSS

### Qué pasa

Tienes 5 sitios con `border: ... red` que son claramente marcadores temporales para "aquí va un icono":

```scss
// search-anime.scss:7
.buscar__anime { border: 2px solid red; }

// myListPage.scss:26
&--img { border: 1px solid red; height: 20px; width: 20px; }

// animepage.scss:20 (breadcrumbs)
&-img { border: 2px solid red; height: 20px; width: 20px; }

// animeCard.scss:63
.anime-card__score-icon { border: solid 1px red; }

// animeCard.scss:136
.anime-card__button-img { border: solid 1px red; }
```

Y en el HTML, los `<img>` correspondientes tienen `src="#"` o **sin src en absoluto**:

```tsx
<img className="anime-card__score-icon" src="#" />
<img className="anime-card__button-img"></img>   {/* sin src */}
<img className="my-list__search--img"></img>      {/* sin src */}
```

### Por qué importa

- Visualmente quedan **iconos rotos** (icono de imagen rota del navegador) o pequeños recuadros rojos. En tu app no se nota tanto porque están encima de fondos oscuros, pero en una review profesional te las penalizarían en 2 segundos.
- `<img>` sin `src` **dispara una request fallida** al navegador (intenta resolver la URL actual como imagen). Es una request 404 por cada icono → +5 requests inútiles por carga.
- Lighthouse audit `image-alt` no pasa porque ninguno de esos `<img>` tiene `alt`.

### Cómo lo arreglas

Dos caminos según lo que sea realmente cada uno:

**Si es un icono decorativo** (estrella de score, lupa de búsqueda, flecha de breadcrumb) → SVG inline o icon font:

```tsx
// AnimeCard.tsx — para la estrella de score
<div className="anime-card__score">
  <svg className="anime-card__score-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
  <p>{anime.score ?? "N/A"}</p>
</div>
```

`aria-hidden="true"` indica que el icono es decorativo — el lector de pantalla ignora el SVG y lee solo el texto del score.

**Si es un icono que aporta información** (avatar, miniatura) → `<img src="..." alt="descripción">`.

Y quita los `border: ... red` del SCSS cuando los iconos reales estén ahí.

**Heuristic rápida para auditarse uno mismo:** busca en tu proyecto `red`, `border: 1px solid red`, `// TODO`, `// FIX`. Si algo aparece, es deuda visible.

### 💡 Aprendizaje

**Los placeholders en código se quedan para siempre si no los marcas.** Convención que funciona: cuando dejas algo a medias, marca con `// TODO: icono pendiente — issue #X` y revisa los TODOs antes de cada PR. Y nunca dejes `border: red` o `background: pink` en una rama que vayas a mergear. Para depurar visualmente, usa **DevTools** (Inspect Element → toggle box-shadow). Es invisible para el código.

---

## 6. 🔄 Imágenes sin `alt` (sección 3 de v1) — y el patrón `background-image` ha eliminado unas pero creado otras

### Qué pasa

Buenas noticias: **las portadas de anime ya no son `<img>`** sino `background-image`. Eso resuelve el problema en `AnimeCard`. Mala noticia: ahora la información visual "esto es la portada de X" no está en ningún sitio del DOM. Un lector de pantalla pasa por la tarjeta y no sabe **qué imagen está viendo**.

Y los `<img>` que quedan siguen con problemas:

```tsx
// AnimePage.tsx:52 — flecha de breadcrumb
<img src="#" alt="" className="breadcrumbs__container-img" />

// LoginPage.tsx:28, 31 — logo + flecha back
<img src="#" alt="Narime logo" className="login-page__logo" />
<img src="#" alt="" />

// AnimeCard.tsx:27 — icono score
<img className="anime-card__score-icon" src="#" />

// AnimeCard.tsx:45 — icono botón
<img className="anime-card__button-img"></img>

// MyListPage.tsx:180 — lupa búsqueda
<img className="my-list__search--img"></img>

// SearchAnimeComponent.tsx:92 — miniatura
<img className="anime-search__card-img" src={anime.image} />   ← sin alt

// AnimePage.tsx:58 — portada anime (esta sí está bien)
<img src={animeInfo.image} alt={animeInfo.title} />  ✅
```

### Por qué importa

- Las portadas como `background-image` están **invisibles para a11y**. Si un usuario ciego abre la directory, oye *"link, watching, 12 de 28 episodes, Frieren, botón Edit"* — pero no oye que es una portada, ni que es de un anime concreto. El `<h2>{anime.title}</h2>` que tienes ayuda pero no es lo mismo que un `alt` descriptivo.
- Lighthouse mantiene el `image-alt` audit al 0%.
- 50 imgs en el directorio con `src="#"` o sin src → 50 requests fallidas por carga.

### Cómo lo arreglas

**1. Para el `<Link>` que envuelve la tarjeta** (sección 3 de este reporte), añade `aria-label`:

```tsx
<Link
  to={`/anime/${anime.id}`}
  className="anime-card"
  style={{ backgroundImage: `url(${anime.image})` }}
  aria-label={`${anime.title} — ${anime.episodes} episodios — Score ${anime.score ?? "sin puntuar"}`}
>
```

Esto resuelve el problema de la portada como background sin necesidad de un `<img>` adicional.

**2. Para los iconos placeholder** — ver sección 5 (cambiar `<img src="#">` por SVG inline con `aria-hidden`).

**3. Para la miniatura del search dropdown** (`SearchAnimeComponent.tsx:92`):

```tsx
<img className="anime-search__card-img" src={anime.image} alt={`Portada de ${anime.title}`} />
```

**4. Para el "logo" del login** (`LoginPage.tsx:28`):

```tsx
{/* Si todavía no tienes logo, no pongas <img src="#"> — pon el texto: */}
<h1 className="login-page__logo">Narime</h1>
```

### 💡 Aprendizaje

**`background-image` no es un sustituto de `<img>` cuando la imagen aporta información.** Es la herramienta correcta para:
- Decoraciones que no añaden contenido (hero backgrounds, gradientes superpuestos).
- Imágenes donde necesitas control fino de posición/recorte que `<img>` no te da fácil.

Pero pierde alt, lazy-loading nativo (`loading="lazy"`), srcset/sizes, y semántica. Si la imagen **es** el contenido (portada de un producto, foto de perfil), tiene que ser `<img>` con su `alt`. Para tu caso de las cards, ya que has elegido background, **compensa con `aria-label` en el `<Link>`**.

---

## 7. 🔄 CSS reset elimina `outline` sin reemplazar (sección 9 de v1)

### Qué pasa

`src/scss/base/_reset.scss:16` sigue exactamente igual:

```scss
input, button, textarea, select {
  font: inherit;
  border: none;
  outline: none;     ← esto
  background: none;
}
```

Y la búsqueda confirma que **no hay un solo `:focus` ni `:focus-visible` en todo el SCSS**. Has añadido muchísimo CSS nuevo (`tabNavigation`, `animeCard`, `myListPage`, `modalAddEditAnime`) y en ningún sitio aparece focus.

### Por qué importa

Repito el ejercicio de v1: carga tu app, pulsa `Tab` continuamente sin tocar el ratón. **¿Sabes dónde estás?** No. Para usuarios de teclado tu app es invisible.

Ahora con más botones (tabs, modal, "Cargar más", "Cerrar sesión"), el problema crece.

### Cómo lo arreglas

Añade en `_base.scss`:

```scss
button, a, input, select, textarea, [tabindex] {
  &:focus-visible {
    outline: 2px solid var(--color-red-primary);
    outline-offset: 2px;
    border-radius: var(--border-radius-xs);
  }
}
```

Y, dentro del reset, cambia `outline: none` a solo aplicarlo en `:focus` (no en `:focus-visible`):

```scss
input, button, textarea, select {
  font: inherit;
  border: none;
  background: none;

  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: 2px solid var(--color-red-primary);
    outline-offset: 2px;
  }
}
```

`:focus-visible` solo aparece con teclado, no con ratón. Es lo que quieres.

### 💡 Aprendizaje

**`outline: none` sin reemplazo es como cubrir una alarma de incendios — silencia el problema pero no lo resuelve.** Esta regla no caducó en v1: cada nuevo componente interactivo que añadas necesita un `:focus-visible`. Si te lo apuntas como ritual ("siempre que cree un `<button>` o `<Link>`, comprobar focus"), nunca más se te olvida.

---

## 8. 🔄 + 🆕 `100vh` sigue presente y ahora también en componentes (sección 14 de v1)

### Qué pasa

En v1 había 3 sitios con `100vh`. Ahora hay **6**:

```scss
src/components/error/errorComponent.scss:4   → calc(100vh - 151px)
src/components/loading/loadingComponent.scss:6 → calc(100vh - 151px)
src/view/animePage/animepage.scss:2          → calc(100vh - 50px)
src/view/animePage/animepage.scss:38         → 100vh (anime-page__container)
src/view/login/login-page.scss:2             → calc(100vh - 50px)
src/view/register/register.scss:2            → calc(100vh - 50px)
```

Lo nuevo: `loadingComponent.scss` y `errorComponent.scss` usan `calc(100vh - 151px)`. El comentario incluso dice *"lo que mide la barra superior"*. En móvil esa medida no es estable, por lo que en Safari iOS el spinner queda recortado o aparece scroll vertical.

Y `anime-page__container` con `height: 100vh` **dentro de** `.anime-page { height: calc(100vh - 50px) }` → contenedor hijo más alto que el padre → scroll vertical garantizado.

### Por qué importa

- iOS Safari / Chrome Android: la barra del navegador hace que `100vh` salte. Cuando aparece y desaparece, tu layout cambia de altura.
- Hardcodear "menos 151px de la barra superior" en cada componente acopla todos a la decisión del menú. Si cambias la altura del menú, hay que tocar 4 archivos.

### Cómo lo arreglas

**1. Usar `dvh` (dynamic viewport height) — soportado desde 2022:**

```scss
.anime-page,
.login-page,
.register-page {
  min-height: 100vh;      // fallback navegadores viejos
  min-height: 100dvh;     // los modernos usan este
}
```

`min-height` en lugar de `height` para que si el contenido crece (errores de validación, listas largas) no se recorte.

**2. La altura "menos la barra del menú" puedes hacerla con una CSS custom property:**

```scss
:root {
  --menu-height: 50px;
}
.menu { height: var(--menu-height); }
body { padding-top: var(--menu-height); }

.loading-component__container,
.error-component__container {
  min-height: calc(100dvh - var(--menu-height));
}
```

Cambias `--menu-height` una vez y se actualiza en cascada.

**3. `anime-page__container { height: 100vh }` simplemente bórralo.** Ya está dentro de `.anime-page` que tiene su propia altura. Ese `100vh` dentro de un padre limitado es redundante y peligroso.

### 💡 Aprendizaje

**Hardcodear medidas que dependen unas de otras es deuda.** Si el header mide 50px y tres componentes ponen `calc(100vh - 50px)`, cuando rediseñes el header tienes 3 sitios que romper. Variables CSS (`--menu-height`) o un sistema de layout con `display: grid; grid-template-rows: auto 1fr` te lo evitan. Y en móvil, **siempre `dvh`** (o `svh`/`lvh` si tienes razones específicas).

---

## 9. 🔄 Tarjetas no responsive: `width: calc((100% - 128px) / 5)` (sección 8 v1)

### Qué pasa

En `animeCard.scss:4`:

```scss
.anime-card-wrapper {
  // Quiero 5 tarjetas por fila, pues 100%/ 5 = 20% - 192 ya que el gap es de 48px,
  // 48x 4 = 192, cuatro espacios  intermedios entre tarjetas /5 tarjetas a las que dividir el espacio
  width: calc((100% - 128px) / 5);
  height: 400px;
  ...
}
```

El comentario muestra que pensaste el cálculo — bien. Pero ese cálculo **solo funciona para una resolución concreta**. En móvil 375px de viewport, cada tarjeta queda a `(375 - 128) / 5 = 49 px de ancho`. Inusable.

Y hay 0 `@media queries` en todo el proyecto. Confirmado por grep.

### Cómo lo arreglas

**CSS Grid con `auto-fill + minmax` te regala responsive sin un solo media query:**

```scss
// directorypage.scss
.anime-cards__container {
  padding: var(--space-xl) var(--space-xxl);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-xl);
}

// animeCard.scss
.anime-card-wrapper {
  width: 100%;          // ocupa la celda completa del grid
  height: 400px;
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
}
```

Qué hace `repeat(auto-fill, minmax(200px, 1fr))`:
- Cada columna **mide al menos 200px** y crece hasta `1fr` (el espacio sobrante repartido).
- Cabe el número de columnas que puedan a partir de ese mínimo.
- En desktop 1280px → ~5 columnas. En tablet 768px → ~3. En móvil 375px → 1-2.

Es **el patrón estándar para grids de tarjetas**. Saberlo te ahorra escribir 4 media queries.

Para el padding lateral del contenedor, sí necesitas un media query:

```scss
.anime-cards__container {
  padding: var(--space-l) var(--space-m);

  @media (min-width: 768px) {
    padding: var(--space-xl) var(--space-xxl);
  }
}
```

### 💡 Aprendizaje

**`grid-template-columns: repeat(auto-fill, minmax(<min>, 1fr))` es la herramienta de layout más rentable que existe.** Una sola línea, responsive de gratis, sin media queries para casos normales. Aprende a leerla y úsala como reflejo cuando veas "una rejilla de cosas iguales".

---

## 10. 🔄 Bundle JS crecido a 901 kB (sección 11 v1)

### Qué pasa

`npm run build`:

```
dist/assets/index-Bba3_0EM.js          901.11 kB │ gzip: 287.01 kB

(!) Some chunks are larger than 500 kB after minification.
```

El bundle ha crecido de 578 kB a 901 kB (+55%). Las causas:

- `@tanstack/react-query` (+30 kB gzipped)
- `axios` (+13 kB gzipped)
- Componentes nuevos: `ModalAddEditAnime`, `MyListPage`, `UserPage`, `AnimeCard`, hooks, contexts
- Firebase sigue completo (Firebase es notoriamente pesado, ~150 kB gzipped solo de `firebase/auth` + `firestore`)

Y los assets siguen exactamente igual de v1:

```
Inter.woff2:        349 kB
Inter.ttf:          874 kB   ← redundante con woff2
fondo_login.jpg:    335 kB
fondo_singUp.jpg:   421 kB
BebasNeue.ttf:       57 kB   ← redundante
```

### Cómo lo arreglas

**1. Borra los `.ttf`** — woff2 cubre el 99% de navegadores. En `_custom_properties.scss`:

```scss
@font-face {
  font-family: "Inter";
  src: url("../../assets/fonts/Inter.woff2") format("woff2");  // solo woff2
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Bebas Neue";
  src: url("../../assets/fonts/BebasNeue.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

Y borra los archivos `Inter.ttf` y `BebasNeue.ttf` de `assets/fonts/`. **Ahorras 932 kB** del bundle final.

**2. JPGs → WebP** con [squoosh.app](https://squoosh.app):

```scss
// login-page.scss y register.scss
background-image:
  linear-gradient(to top, rgba(0,0,0,.7), rgba(0,0,0,0)),
  url(../../assets/images/fondo_login.webp);
```

WebP al 80% para esos JPGs: probablemente bajen de 335 a ~80 kB.

**3. Code-splitting por ruta — esto te baja el bundle inicial bastante:**

```tsx
// main.tsx
import { lazy, Suspense } from 'react';
const DirectoryPage = lazy(() => import('./view/directoryPage/DirectoryPage.tsx'));
const LoginPage = lazy(() => import('./view/login/LoginPage.tsx'));
const RegisterPage = lazy(() => import('./view/register/RegisterPage.tsx'));
const AnimePage = lazy(() => import('./view/animePage/AnimePage.tsx'));
const MyListPage = lazy(() => import('./view/myListPage/MyListPage.tsx'));
const UserPage = lazy(() => import('./view/userPage/UserPage.tsx'));
const SearchResultsPage = lazy(() => import('./view/searchResultsPage/SearchResultsPage.tsx'));

// En cada ruta:
{
  path: '/anime/:id',
  element: <Suspense fallback={<LoadingComponent text="Cargando..." />}><AnimePage/></Suspense>
}
```

Resultado: el usuario que carga la home **solo descarga el código de la home + libs core**. Cuando vaya a `/login`, descarga `LoginPage.js`. Etc.

**4. Firebase modular:** comprueba que solo importas lo que usas. Sí estás usando importaciones específicas (`firebase/auth`, `firebase/firestore`), bien. Si en algún archivo apareciera `import firebase from 'firebase'` (el namespace entero), eso son 600 kB extra.

### 💡 Aprendizaje

**El crecimiento del bundle es proporcional al número de features**. Aceptas el coste si las features valen la pena. Pero **el coste de los assets duplicados (TTF + WOFF2 al mismo tiempo, JPG sin comprimir) es 100% gratuito de quitar**. Antes de optimizar código, audita la carpeta `dist/assets/` y pregúntate: "¿necesito todo esto?".

---

## 11. 🆕 `<a href="#">` para borrar el anime — es un botón disfrazado

### Qué pasa

En `ModalAddEditAnime.tsx:128`:

```tsx
{action === "edit" && (
  <a href="#" onClick={deleteAnime} className="popup__delete-anime"> delete anime to the list</a>
)}
```

### Por qué importa

- `href="#"` **navega al inicio de la página** antes de que `onClick` haga su trabajo. En SPAs además te cambia el hash del URL sin querer (queda `/directory#` en la barra).
- Semánticamente esto es una acción ("borrar de la lista"), no una navegación. Debe ser un `<button>`.
- Si quisieras añadir `disabled` mientras se procesa el delete, un `<a>` no soporta `disabled`. Tendrías que añadir `pointer-events: none` y `aria-disabled` a mano.

### Cómo lo arreglas

```tsx
{action === "edit" && (
  <button
    type="button"
    onClick={deleteAnime}
    className="popup__delete-anime btn--link"
  >
    Delete anime from the list
  </button>
)}
```

Y en SCSS, una clase de utilidad para "botón que parece link":

```scss
.btn--link {
  background: none;
  border: none;
  color: var(--color-white-75);
  text-decoration: underline;
  cursor: pointer;
  font: inherit;
  padding: 0;

  &:hover { color: var(--color-white); }
  &:focus-visible {
    outline: 2px solid var(--color-red-primary);
    outline-offset: 2px;
  }
}
```

### 💡 Aprendizaje

**Si la pregunta es "¿esto navega a algún sitio o ejecuta una acción?", el elemento se decide solo.** Navega → `<a>`. Ejecuta → `<button>`. El estilo visual (subrayado, color de link) es independiente — lo decides con CSS. Nunca dejes que el aspecto te haga elegir mal el tag.

---

## 12. 🔄 Contraste insuficiente y problemas del menú (sección 10 v1 + nuevos)

### Qué pasa

Lighthouse sigue marcando `color-contrast` al 0%. Los elementos siguen siendo los mismos de v1:

- `.menu { background-color: blanchedalmond; }` en `App.scss:11` — color hardcodeado fuera del design system, con texto blanco encima (porque las `<Link>` heredan color blanco del `<a>` reset) → contraste fatal.
- `.buscar__anime` (input search) con `border: 2px solid red` (debug) y placeholder gris claro sobre fondo casi blanco.
- Variables `--color-white-50` (~55% alpha) usadas en:
  - `.login-page__form-separation-text` ("o")
  - `.login-page__form-forget` ("Forget your password?")
  - `.login-page__form-sing-up` ("You don't have account?")
  - `.breadcrumbs__unselected` (texto "Directory" en breadcrumbs)

### Cómo lo arreglas

Igual que v1 + nuevo:

```scss
// App.scss — quita blanchedalmond
.menu {
  position: fixed;
  inset: 0 0 auto 0;
  display: flex;
  gap: 2rem;
  height: var(--menu-height, 50px);
  background-color: var(--color-black-bg);
  padding: 0 var(--space-l);
  align-items: center;
  z-index: 5;
}
```

Y sube todos los textos con `--color-white-50` a `--color-white-75`. Excepción razonable: los **divisores** ("línea + 'o' + línea") visualmente sí deben ser tenues — pero la "o" del texto debe pasar contraste mínimo. Si lo quieres tenue, déjalo en `--color-white-75` (todavía es claro pero pasa AA).

Verifica resultados en [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

### 💡 Aprendizaje

**Cuando uses una variable de "blanco con opacidad", piensa qué hay debajo.** El alpha bajo solo funciona si el fondo es muy oscuro y contrastado. En tu paleta tienes `--color-white-75` y `--color-white-50` definidos — pero ninguna regla de cuándo usar cada uno. Una mejora futura: documenta en `_colors.scss` con un comentario *"`--color-white-50` solo para divisores y bordes, no texto"*.

---

## 13. 🔄 `index.css` y trailing comma siguen vivos (secciones 12+13 v1)

### Qué pasa

Inalterado desde v1:

```css
/* src/index.css */
* { border: none; }
```

```scss
/* src/scss/base/_base.scss:48 */
body {
  background: linear-gradient(
    130deg,
    var(--color-black-bg) 0%,
    var(--color-black-bg) 70%,
    var(--color-red-bg) 100%,    ← coma final ilegal dentro de linear-gradient()
  );
}
```

### Cómo lo arreglas

```bash
# Borra src/index.css completo
```

```tsx
// main.tsx — quita esta línea
import './index.css'
```

```scss
// _base.scss — sin coma antes del )
body {
  background: linear-gradient(
    130deg,
    var(--color-black-bg) 0%,
    var(--color-black-bg) 70%,
    var(--color-red-bg) 100%
  );
}
```

Estos dos cambios juntos te llevan 90 segundos.

### 💡 Aprendizaje

(Mismas reglas que v1 — repaso porque siguen aplicando.)

**Un proyecto, un reset CSS.** Concentra las reglas base en un único archivo. **Las comas finales en CSS** son válidas en listas de valores (`font-family: "Inter", "Arial",`) pero **no dentro de funciones** (`linear-gradient`, `calc`, `rgb`).

---

## 14. 🆕 `console.log` en rutas críticas

### Qué pasa

7 `console.log` pendientes:

```
src/firebase/services/user-information.firebase.ts:29  console.log("Document data:", docSnap.data());
src/firebase/services/user-information.firebase.ts:32  console.log("No such document!");
src/components/filters-anime/FiltersAnimeComponent.tsx:22  console.log("La api no responde,...")
src/components/search-anime/SearchAnimeComponent.tsx:56  console.log("La api no responde, " + e);
src/view/userPage/UserPage.tsx:16, 19  console.log(dataFirebase); console.log(dataFirebase.email);
src/hooks/useAuthForms.ts:58  console.log("Sesión iniciada en: " + user)
```

### Por qué importa

- En producción, esos logs van a la consola del navegador del usuario. Cualquiera que abra DevTools puede ver `docSnap.data()` con el email del usuario, lo que se logueó, etc. **Es una fuga de información**.
- Ensucia consola, lo cual hace muy difícil encontrar **logs útiles** cuando depures algo real más adelante.

### Cómo lo arreglas

**Borra los `console.log` que ya no usas.** Si tienes algunos que sí quieres mantener para debug:

```ts
// utils/logger.ts
const isDev = import.meta.env.DEV;

export const log = (...args: unknown[]) => {
  if (isDev) console.log(...args);
};
```

Y úsalo en lugar de `console.log`:

```ts
import { log } from "../utils/logger";
log("Document data:", docSnap.data());
```

En build de producción, `import.meta.env.DEV` es `false` → los logs no se ejecutan.

### 💡 Aprendizaje

**Configura ESLint para que te avise.** Añade en tu `.eslintrc`:

```json
{
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

Permitir `console.warn` y `console.error` (para errores reales), prohibir `console.log` (para debug temporal). Lint te avisa y tu commit no incluye basura de debug.

---

## 15. 🆕 Mobile: el menú superior se rompe a <900 px

He hecho captura en 375x812 (`_audit_v2/screenshots/02-home-mobile.png` y `03-login-mobile.png`):

- **Menú superior**: los 5 `<Link>` + el `<SearchAnimeComponent>` se aplastan en horizontal sin saltar a otra línea. La barra se queda en altura fija 50px con todo encima.
- **Login**: las dos columnas `width: 50%` no colapsan a una. El form section queda con padding `0 var(--space-xxxl)` (96px) → el contenido se ahoga.
- **Directory**: las tarjetas con `(100% - 128px) / 5` quedan a ~50 px de ancho cada una. Ilegibles.

### Cómo lo arreglas

Patrones generales que aplican a las tres:

**Menú** — colapsar en hamburguesa o stack a partir de un breakpoint:

```scss
.menu {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-m);
  padding: var(--space-s) var(--space-m);
  height: auto;

  @media (max-width: 768px) {
    // móvil: solo logo + search + hamburguesa
    // los Links se ocultan tras menú-toggle
  }
}
```

**Login y Register** — stack vertical en móvil:

```scss
.login-page {
  display: flex;
  flex-direction: column;       // móvil: una columna
  padding: var(--space-m);
}
.login-page__info,
.login-page__form-section {
  width: 100%;
  padding: var(--space-l);
}

@media (min-width: 768px) {
  .login-page { flex-direction: row; }
  .login-page__info,
  .login-page__form-section { width: 50%; }
  .login-page__form-section { padding: 0 var(--space-xl); }
}
```

**Directory** — ver sección 9 (`auto-fill + minmax`).

### 💡 Aprendizaje

**Cada feature nueva en desktop genera deuda en móvil si no se diseña para los dos a la vez.** Cuando añadas un componente, ábrelo en DevTools > toggle device toolbar a 375px ANTES de declarar terminado. Si en móvil no funciona, no está terminado.

---

## 📋 Plan de acción sugerido

Mismo formato que v1: tres semanas, victorias progresivas. Esta vez con menos cosas porque ya has hecho mucho.

### 🟢 Semana 1 — Cierre de pendientes v1 + bug crítico (1-2 tardes)

> *Lo que ya sabes y lo que no podía esperar.*

- [ ] **Arreglar `UserPage` que crashea sin sesión** (sección 1) — el bug más urgente. **(15 min)**
- [ ] Proteger `/user-page` con `ProtectedRoute` (igual que `/my-list`) **(2 min)**
- [ ] `<html lang="en">` → `lang="es"` **(30 seg)**
- [ ] Rellenar `<head>` con title, meta description, theme-color, OG tags **(15 min)**
- [ ] Borrar `src/index.css` **(1 min)**
- [ ] Quitar coma final en `linear-gradient` de `_base.scss` **(1 min)**
- [ ] Quitar `background-color: blanchedalmond` del menú y usar `--color-black-bg` **(2 min)**
- [ ] `npm audit fix` (solo queda 1 moderate) **(2 min)**
- [ ] Borrar los 7 `console.log` o filtrarlos con `import.meta.env.DEV` **(15 min)**

### 🟡 Semana 2 — Accesibilidad, debug visual y patrones (3-4 tardes)

> *Donde se nota el pulido.*

- [ ] Sustituir `<article onClick>` por `<Link>` en `AnimeCard` + reposicionar botón Add/Edit absoluto **(1 tarde)** — quita los `e.stopPropagation()`
- [ ] Hacer lo mismo en `SearchResultsPage` y `SearchAnimeComponent` (mismo patrón) **(30 min)**
- [ ] Conectar `<label>` con sus inputs en Login, Register, **ModalAddEditAnime** **(1 tarde)**
- [ ] Añadir `:focus-visible` en `_base.scss` aplicable a todo lo interactivo **(30 min)**
- [ ] Quitar los 5 `border: ... red` de debug en SCSS — reemplazar por SVG inline (estrella, lupa, flecha) **(1 tarde)**
- [ ] Quitar todos los `<img src="#">` — reemplazar por SVGs o eliminar **(30 min)**
- [ ] Cambiar `<a href="#" onClick={deleteAnime}>` por `<button type="button">` con clase `.btn--link` **(15 min)**
- [ ] Añadir `aria-label` descriptivo al `<Link>` de cada tarjeta de anime **(20 min)**
- [ ] Subir textos con `--color-white-50` a `--color-white-75` **(15 min)**

### 🔴 Semana 3 — Responsive, performance y polish (3-5 tardes)

> *El trabajo de portfolio.*

- [ ] Tarjetas: `width: calc(...)` → `display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))` **(15 min)**
- [ ] Login/Register responsive: stack en móvil, dos columnas desde 768px **(1 tarde)**
- [ ] Menú superior responsive (hamburguesa o flex-wrap simple) **(1 tarde)**
- [ ] `100vh` → `100dvh` con fallback en las 6 ubicaciones **(20 min)**
- [ ] `--menu-height` como variable CSS para evitar el hardcode "151px" / "50px" **(20 min)**
- [ ] Borrar `Inter.ttf` y `BebasNeue.ttf` (ahorras 932 kB del bundle final) **(5 min)**
- [ ] Convertir `fondo_login.jpg` y `fondo_singUp.jpg` a WebP en squoosh.app **(15 min)**
- [ ] Code-splitting con `lazy()` para todas las páginas en `main.tsx` **(1 tarde)** — bundle inicial se parte
- [ ] Configurar ESLint con `no-console` warn **(10 min)**

### 📈 Objetivos por semana

| Métrica | Hoy (v2) | Fin S1 | Fin S2 | Fin S3 |
|---|---|---|---|---|
| Accesibilidad Lighthouse | 81 | 88 | 96 | 100 |
| Best Practices | 77 | 90 | 95 | 100 |
| SEO | 75 | 95 | 100 | 100 |
| CLS | 0.00 ✅ | 0.00 ✅ | 0.00 ✅ | 0.00 ✅ |
| Bundle JS gzipped | 287 kB | 287 kB | 287 kB | **~150 kB** |
| Vulnerabilidades npm | 1 moderate | **0** | 0 | 0 |

---

## 🎓 Recursos para profundizar

Mismos que v1, aún válidos:

- **[web.dev/learn/html](https://web.dev/learn/html/)** · **[web.dev/learn/css](https://web.dev/learn/css/)** · **[web.dev/learn/performance](https://web.dev/learn/performance/)**
- **[WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)** — checklist filtrable por AA
- **[WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)** — bookmark obligatorio
- **[axe DevTools (Chrome)](https://chrome.google.com/webstore/detail/axe-devtools/lhdoppojpmngadmnindnejefpokejbdd)**
- **[squoosh.app](https://squoosh.app)** — compresor de imágenes

Nuevos relevantes para tu stack actual:

- **[TanStack Query — caching & invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)** — el siguiente paso es entender `staleTime`, `gcTime`, invalidación tras mutaciones. Hace que la UI se sienta instantánea.
- **[React Router v7 — data routers](https://reactrouter.com/start/data/route-object)** — ya estás usando `loader`, mira también `action` y `defer` para optimistic UI.
- **[Firebase modular SDK best practices](https://firebase.google.com/docs/web/modular-upgrade)** — para asegurar que el tree-shaking elimina lo que no usas.
- **[ARIA Authoring Practices Guide — Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)** — patrones de a11y para modal, tabs, listbox. Tu modal Add/Edit y tu tab navigation lo necesitan.

---

## ✨ Cierre

Paula, esto es otra app comparada con la de hace un mes. Antes era *"un proyecto que funciona"*. Ahora es *"un proyecto con arquitectura"*. Has metido contexts, hooks personalizados, react-query, react-memo, useMemo, modal con form, sistema de tabs, status badges semánticos, y has resuelto el CLS de la última auditoría (de 0.23 a 0.00 ✅).

Los puntos que aparecen en este reporte siguen siendo **detalles de superficie**: head, alt, focus, responsive. Lo importante de fondo —arquitectura, separación de concerns, patrones React, performance core— **lo estás haciendo bien**. El próximo salto es traducir esa solidez interna a una superficie igual de pulida.

Hay un bug real (UserPage crasheando) que merece atención prioritaria, y luego el resto es ir cerrando pendientes. Si me preguntas dónde gastar primero el tiempo:

1. Bug de UserPage + ProtectedRoute (15 min).
2. `<head>` completo (15 min).
3. Quitar los `border: red` y los `src="#"` (30 min en total).

Con eso, tres tareas de menos de una hora, tu Lighthouse sube ~10 puntos y la app pasa el "mira esto, qué te parece" de cualquier reclutador o profe.

Lo demás —responsive, focus styles, code-split— es lo que hace la diferencia entre "lo lleva un junior" y "lo lleva alguien con mirada de senior". Y por todo lo que has hecho en 48 commits, esa mirada ya la tienes. Solo falta llevarla a los píxeles. 🎌

---

*Auditoría v2 generada con Chrome DevTools MCP + Lighthouse + análisis estático · `19/05/2026` · comparada con v1 `22/04/2026`*
