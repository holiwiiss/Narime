# Auditoría de Calidad Web, Narime

> **Proyecto:** Narime · **Estudiante:** Paula
> **Fecha:** 22 de abril de 2026 · **Rama:** `main` · **Commit:** `9865e49`
> **URL auditada:** `http://localhost:5174/`
> **Enfoque:** HTML · CSS · Performance

---

## Antes de empezar: tu punto de partida

Antes de meternos en lo que se puede pulir, quiero que veas **todo lo que ya has hecho bien**. Esto no es relleno: son decisiones que separan un proyecto de estudiante de un proyecto profesional, y tú las has tomado:

1. **Sistema de design tokens bien montado.** Tienes `_custom_properties.scss` con escala de spacing (`--space-xxs` → `--space-xxxl`), escala tipográfica numerada (`--font-size-1` → `--font-size-9`), radios de borde y pesos de fuente. Esto es arquitectura CSS real.
2. **Capa de semántica sobre tokens.** No usas `--font-size-9` en los componentes, usas `--h1-size: var(--font-size-9)`. Separar *"qué es"* de *"qué vale"* es oro puro. Cuando cambies la escala, no tocas los componentes.
3. **Arquitectura SCSS con `@forward` y carpetas `base/` + `variables/`.** Esto es el patrón 7-1 simplificado. Muy por encima del "un `.scss` gigante" que suele aparecer en proyectos iniciales.
4. **Reset CSS moderno.** `box-sizing: border-box` globalizado, `max-width: 100%` en `img`, margins/paddings a 0. Base sólida.
5. **Fuentes locales con `woff2` primero y `font-display: swap`.** Has priorizado el formato moderno y evitas el FOIT (flash invisible de texto). Muy bien pensado.
6. **Componentes extraídos con sentido.** `Pagination`, `LoadingComponent`, `ErrorComponent`, `SearchAnimeComponent`, separación correcta, no un monolito.
7. **Uso de `<main>`, `<header>`, `<section>` en `AnimePage`, `LoginPage` y `RegisterPage`.** Eso es HTML semántico de verdad. En la página de Anime incluso hay `alt` con el título del anime - detalle fino.
8. **TypeScript tipado en servicios y props.** `type PaginationProps`, `type LoadingProp`… nada de `any` sueltos.
9. **Validación de formularios con `react-hook-form` y mensajes de error propios.** Regex para password robusta, `minLength`, validación cruzada entre `password` y `passwordConfirm`.
10. **`.env` correctamente gitignored.** Tu `.gitignore` tiene `.env` listado y las claves de Firebase van por variables de entorno. No hay keys hardcodeadas. Profesional.

Con esa base, lo que viene ahora no son "errores graves", son los detalles que llevan el proyecto del nivel "funciona" al nivel "parece hecho por alguien que sabe".

---

## Scores Lighthouse

| Categoría | Desktop | Mobile |
|---|---|---|
| Accesibilidad | **81** | **81** |
| Best Practices | **77** | **77** |
| SEO | **75** | **75** |
| Performance (LCP) | 240 ms ✅ | 240 ms ✅ |
| Performance (CLS) | **0.23** ⚠️ | **0.23** ⚠️ |

*Lighthouse no puntúa Performance sobre dev server (Vite), por eso solo las métricas observadas. CLS por encima de 0.1 cuenta como "malo", ese es el gran objetivo del reporte.*

---

## Cómo leer este documento

Cada sección tiene cuatro partes:

- **Qué pasa**, descripción neutra + ejemplo real de tu código.
- **Por qué importa**, contexto didáctico. No es "está mal", es "esto lo ve/no lo ve un usuario real".
- **Cómo lo arreglas**, código concreto que puedes copiar.
- **💡 Aprendizaje**, la regla mental que quiero que te lleves, aplicable a cualquier proyecto futuro.

He ordenado las secciones por **valor didáctico**, no por severidad técnica. Lo primero que arreglas es lo que más aprendes arreglando.

---

## 1. El `<html lang="en">` miente sobre tu idioma

### Qué pasa

En `index.html:2` tienes:

```html
<html lang="en">
```

Pero tu app mezcla inglés y español ("Registro", "Contraseña", "Aquí tienes los resultados de tu búsqueda", "atras", "siguiente"). Principalmente es español.

### Por qué importa

`lang` es lo primero que leen:

- **Lectores de pantalla** (JAWS, NVDA, VoiceOver): cambian la voz y la pronunciación según el idioma. Con `lang="en"`, un lector de pantalla español pronuncia "Contraseña" como si fuera inglés. Experiencia horrible para personas ciegas.
- **Google**: usa `lang` para saber a qué audiencia servir la página.
- **Chrome**: decide si ofrecer traducción automática basándose en este atributo.

### Cómo lo arreglas

```html
<!doctype html>
<html lang="es">
```

Si más adelante haces la app bilingüe, lo actualizas desde JS según el idioma activo: `document.documentElement.lang = currentLang`.

### Aprendizaje

**El atributo `lang` no es decorativo.** Es metadata que máquinas (buscadores, lectores de pantalla, navegadores) usan para tomar decisiones antes de que el HTML se renderice. Si tu app es en español, `lang="es"`. Siempre.

---

## 2. El `<head>` está casi vacío, falta identidad de la página

### Qué pasa

Tu `index.html`:

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>narime</title>
</head>
```

No hay `meta description`, no hay `theme-color`, no hay Open Graph tags, el favicon es todavía el logo de Vite, y el `<title>` es literal `narime` en minúscula.

Lighthouse marca dos audits fallidos por esto: **`meta-description`** y **`robots-txt` no válido**.

### Por qué importa

- **Compartir por WhatsApp/Twitter/Discord:** sin Open Graph tags, el enlace aparece como "narime - narime" sin imagen, sin texto. Hoy día lo que se comparte es lo que trae tráfico.
- **Google:** el `<title>` y `meta description` son literalmente lo que aparece en los resultados de búsqueda. Ahora mismo sales como "narime" sin descripción.
- **Móvil (Android):** `theme-color` pinta la barra del navegador del color de tu marca. Sin él, queda el gris plomo de Chrome.

### Cómo lo arreglas

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Narime · Tu directorio personal de anime</title>
    <meta name="description" content="Descubre, puntúa y organiza tu anime favorito. Rankings, temporadas y listas personales en un solo sitio." />
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

### 💡 Aprendizaje

**El `<head>` es el CV de tu web.** Todo lo que pasa *antes* de que se vea el contenido (compartir, buscar, previsualizar) depende de esas 8-10 líneas. Un `<head>` bien rellenado es lo primero que distingue un proyecto de portfolio de uno "de clase".

---

## 3. Imágenes sin `alt`: rompen accesibilidad y Lighthouse lo penaliza directamente

### Qué pasa

En 4 sitios diferentes hay `<img>` sin `alt` alguno:

```tsx
// DirectoryPage.tsx:96
<img src={anime.image}/>

// SearchResultsPage.tsx:72
<img src={anime.image}/>

// SearchAnimeComponent.tsx:92
<img src={anime.image} />

// AnimePage.tsx:133, 136  (personajes y seiyuus)
<img src={person.characterImage} />
<img src={person.voiceActorImage} />
```

Y en tres componentes hay un patrón aún más grave, `<img src="#">`:

```tsx
// LoadingComponent.tsx:10, ErrorComponent.tsx:10
<img src="#"></img>

// LoginPage.tsx:48, 51
<img src="#" alt="Narime logo" />
<img src="#" alt="" />
```

`src="#"` hace que el navegador intente cargar la URL actual como imagen, la descargue entera, y falle. Es un bug de carga real (no solo a11y).

### Por qué importa

- **Lectores de pantalla** leen el `src` o el nombre del archivo cuando no hay `alt`. Imagina oír *"imagen punto, imagen punto, imagen punto"* 25 veces en tu página Directory.
- **Si la imagen no carga** (red caída, URL rota), sin `alt` el usuario ve un icono roto sin contexto. Con `alt="Portada de Frieren"` al menos sabe qué faltaba.
- **Lighthouse marca `image-alt` como 0%**, es un audit de accesibilidad que pesa.
- **`src="#"` dispara una segunda descarga del HTML completo**. Es un bug de performance camuflado de bug de UI.

### Cómo lo arreglas

Si la imagen **aporta información** (portada del anime, foto del personaje) → `alt` descriptivo:

```tsx
<img src={anime.image} alt={`Portada de ${anime.title}`} />
<img src={person.characterImage} alt={`Personaje: ${person.characterName}`} />
```

Si la imagen es **decorativa** (iconos, fondos que no añaden info) → `alt=""` (vacío, pero presente):

```tsx
<img src={icono} alt="" />
```

Y los placeholders `src="#"`, o los completas con un asset real, o quitas el `<img>` entero:

```tsx
// En LoadingComponent.tsx, en vez de <img src="#">, usa:
<div className="loader-spinner" aria-hidden="true"></div>
// + un spinner en CSS puro
```

### Aprendizaje

**Toda `<img>` necesita un `alt`. Sin excepciones.** La única pregunta es: ¿aporta información? Si sí, descríbelo. Si no, `alt=""`. Pero nunca, nunca, lo omitas. Y `src="#"` no es un placeholder válido, es una descarga fallida.

---

## 4. `<div onClick>` en lugar de `<button>` o `<Link>` - la trampa de accesibilidad más común

### Qué pasa

Las tarjetas de anime se navegan así:

```tsx
// DirectoryPage.tsx:94
<div key={anime.id} className="anime__card" onClick={() => navigate(`/anime/${anime.id}`)}>
  <h1>{anime.title}</h1>
  ...
</div>

// SearchResultsPage.tsx:70 (mismo patrón)
// SearchAnimeComponent.tsx:91 (mismo patrón)
```

### Por qué importa

Un `<div>` **no es focusable** (no llega con `Tab`), **no es activable con teclado** (Enter/Space no funcionan), y **lectores de pantalla no lo anuncian como clickable**. Para alguien que navegue sin ratón, tu catálogo de animes simplemente no se puede usar.

Además, haciendo clic con el botón central del ratón (o Ctrl+clic) no se abre en pestaña nueva, porque no es un enlace real. Ese gesto es universal en la web.

### Cómo lo arreglas

Como el destino es una URL, la herramienta correcta es `<Link>`:

```tsx
import { Link } from "react-router-dom";

<Link to={`/anime/${anime.id}`} className="anime__card">
  <h1>{anime.title}</h1>
  <img src={anime.image} alt={`Portada de ${anime.title}`} />
  <div className="information__container">
    <h2>Score: {anime.score}</h2>
    <h2>Episodes: {anime.episodes}</h2>
  </div>
</Link>
```

Y el botón "Add to list" que hay dentro, ojo, un `<Link>` no puede contener un `<button>` con su propia acción (anidar interactivos rompe a11y). Sácalo fuera de la tarjeta o usa un diseño donde la tarjeta sea el enlace y "Add to list" sea un botón absoluto encima con `stopPropagation` en su click.

Si el destino NO es una URL (p. ej. un modal) → `<button>` con `type="button"`:

```tsx
<button type="button" onClick={...} className="anime__card">
  ...
</button>
```

### 💡 Aprendizaje

**`<div onClick>` es casi siempre el síntoma de "elegí el elemento por cómo se ve, no por lo que hace".** Regla: ¿navega a una URL? `<a>` / `<Link>`. ¿Dispara una acción en la página? `<button>`. `<div>` es contenedor visual, nunca interacción.

---

## 5. `<label>` sin conexión a su `<input>`: formularios rotos para teclado

### Qué pasa

En `LoginPage.tsx`, `RegisterPage.tsx` y `AnimePage.tsx` los labels están así:

```tsx
// LoginPage.tsx:73
<div className="login-page__form-field">
  <label>Email</label>
  <input type="email" {...register('email', { ... })}/>
</div>
```

Visualmente el label y el input van juntos, pero **a nivel HTML no están conectados**.

### Por qué importa

- Hacer **clic en el texto "Email"** no enfoca el input. En móvil, donde el área táctil es pequeña, perder ese clic es rechazo directo.
- Un lector de pantalla al llegar al input lee *"editable sin etiqueta"* en vez de *"Email, editable"*.
- Chrome DevTools > Issues reporta esto como *"A form field element should have an id or name attribute"*, lo tienes en tu consola ahora mismo.

### Cómo lo arreglas

Opción 1 (más semántica, recomendada): envolver el input dentro del label.

```tsx
<div className="login-page__form-field">
  <label>
    Email
    <input type="email" {...register('email', { required: 'Este campo es obligatorio' })} />
  </label>
</div>
```

Opción 2: usar `htmlFor` + `id`.

```tsx
<div className="login-page__form-field">
  <label htmlFor="login-email">Email</label>
  <input
    id="login-email"
    type="email"
    {...register('email', { required: 'Este campo es obligatorio' })}
  />
</div>
```

*(Importante: en React se llama `htmlFor`, no `for`, ya que `for` es palabra reservada.)*

### Aprendizaje

**`<label>` al lado del `<input>` visualmente no es lo mismo que conectado por HTML.** Un formulario accesible se prueba así: haz clic en el texto del label, si el input no se enfoca, el label está desconectado.

---

## 6. Jerarquía de headings desordenada: `<h1>` × 25 en una sola página

### Qué pasa

En la Directory hay esto:

```tsx
// DirectoryPage.tsx, dentro del .map de tarjetas
<div className="anime__card" onClick={...}>
  <h1>{anime.title}</h1>       ← h1 por cada tarjeta
  ...
  <h2>Score: {anime.score}</h2>
  <h2>Episodes: {anime.episodes}</h2>
</div>
```

Resultado medido en DevTools: **25 `<h1>` y 50 `<h2>` en la misma página**. Y la página Directory en sí no tiene un `<h1>` propio (la web entera no te dice "estás en el Directorio").

Mismo patrón en `SearchResultsPage`. En `AnimePage` hay también `<h2>Hastags</h2>`, con errata (*Hashtags*).

### Por qué importa

Los headings son **la tabla de contenidos** de tu página para lectores de pantalla. Los usuarios ciegos navegan saltando de `h1` a `h1`, de `h2` a `h2`. Con 25 `h1`, esa tabla se vuelve inútil.

SEO: Google usa `h1` para entender de qué va la página. Con 25 `h1` iguales a nombres de anime, el tema de la página se pierde.

Visualmente también explota el diseño: los nombres largos tipo *"Gintama Movie 2: Kanketsu-hen - Yorozuya yo Eien Nare"* aparecen con tu `--h1-size: 3rem` (48 px) y rompen el grid de tarjetas.

### Cómo lo arreglas

Regla: **un único `<h1>` por página = el título de esa página**. A partir de ahí, `<h2>`, `<h3>` según jerarquía.

```tsx
const DirectoryPage = () => {
  return (
    <>
      <h1 className="sr-only">Directorio de anime</h1>
      {/* o visible si quieres: <h1>Directorio</h1> */}

      <div className="bton__container">...</div>

      <div className="cards__container">
        {animeList.map(anime => (
          <Link to={`/anime/${anime.id}`} key={anime.id} className="anime__card">
            <h2>{anime.title}</h2>   {/* título de la tarjeta = h2 */}
            <img src={anime.image} alt={`Portada de ${anime.title}`} />
            <div className="information__container">
              <p>Score: {anime.score}</p>      {/* NO son headings */}
              <p>Episodes: {anime.episodes}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
```

"Score" y "Episodes" **no son encabezados de sección**, son metadatos. Deben ser `<p>`, o mejor un `<dl>/<dt>/<dd>`:

```tsx
<dl className="information__container">
  <dt>Score</dt><dd>{anime.score}</dd>
  <dt>Episodes</dt><dd>{anime.episodes}</dd>
</dl>
```

La utility `.sr-only` para ocultar visualmente pero mantener accesible:

```scss
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
```

Y de paso: `Hastags` → `Hashtags` en `AnimePage.tsx:110`.

### Aprendizaje

**Los headings (h1-h6) son estructura, no estilo.** Si quieres "texto grande", usa CSS (`font-size`, clase `.title-xl`). Si estás marcando un **nuevo apartado de contenido**, usa un heading, con el nivel que toque según la jerarquía. Regla clara: un `h1` por página. `h2` para cada sección. `h3` para subsecciones de una `h2`. Nunca saltes niveles (h1 → h3).

---

## 7. CLS 0.23 - los saltos de layout que ves al cargar son medibles y solucionables

### Qué pasa

El Performance Trace que corrí con Chrome DevTools devuelve:

- **LCP:** 240 ms ✅ (excelente, el contenido principal pinta rapidísimo)
- **CLS:** **0.23** ⚠️ (el umbral "bueno" es < 0.1; de 0.1 a 0.25 es "mejorable"; >0.25 "malo")

CLS (*Cumulative Layout Shift*) mide cuánto se mueven los elementos de su sitio después de pintarse. Tus **25 imágenes de la Directory se descargan sin dimensiones declaradas** → cuando llegan, empujan el contenido hacia abajo. Cada empujón suma al CLS.

Además, `@font-face Bebas Neue` con `swap` cambia la tipografía del texto a mitad de carga → los h1/h2 cambian de ancho → más CLS.

### Por qué importa

- **Google lo penaliza en ranking** (Core Web Vitals son factor de SEO desde 2021).
- **Experiencia real:** estás a punto de pulsar un botón y de repente se desplaza hacia abajo,  pulsas otra cosa. Esto se llama *"content jumping"* y es la queja nº 1 de UX móvil.
- **Accesibilidad motora:** para usuarios con temblor o control limitado, los saltos hacen la web inusable.

### Cómo lo arreglas

**1. Declara `width` y `height` en todas las imágenes**, aunque luego las escales con CSS:

```tsx
<img
  src={anime.image}
  alt={`Portada de ${anime.title}`}
  width="236"
  height="334"
  loading="lazy"
/>
```

El navegador reserva el espacio antes de descargar la imagen → no hay salto. Con `loading="lazy"` encima, solo descarga las que están cerca del viewport.

Si no sabes las dimensiones exactas (API te devuelve cualquier ratio), fija el contenedor con `aspect-ratio`:

```scss
.anime__card img {
  width: 100%;
  aspect-ratio: 2 / 3;  /* ratio típico de portadas de anime */
  object-fit: cover;
}
```

**2. Precarga la fuente principal** para que no haya "flash" al cambiar:

```html
<!-- en index.html, dentro de <head> -->
<link rel="preload" href="/src/assets/fonts/BebasNeue.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/src/assets/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin />
```

*(Ojo: en producción Vite genera nombres con hash. Mejor: usa `size-adjust` y `ascent-override` en el `@font-face` para que la fuente fallback ocupe lo mismo que la final.)*

### 💡 Aprendizaje

**`<img>` sin `width`/`height` es un ticket garantizado al CLS.** Siempre. Incluso si la imagen es responsive y el tamaño real lo decides con CSS, el HTML necesita saber el **ratio** para reservar espacio. Es de los cambios de menos esfuerzo y más impacto medible que hay.

---

## 8. Cero `@media queries`: la web se rompe a <900 px

### Qué pasa

Busqué `@media` en todo `src/` y **no hay ni una**. Revisado en viewport 375 × 812 (móvil estándar): la página login, que divide en dos columnas al 50% cada una, queda con cada columna a 187 px con todo el contenido aplastado. El directorio tiene `.anime__card { width: 18%; }`, en móvil las tarjetas quedan a ~65 px. Ilegibles.

Las pages usan patrones fijos:

```scss
// login-page.scss
.login-page__info { width: 50%; }
.login-page__form-section { width: 50%; padding: 0 var(--space-xxxl); /* 96px!! */ }

// directorypage.scss
.anime__card { width: 18%; }  // fijo 18% sin minmax
```

### Por qué importa

- **~60% del tráfico web es móvil.** Si la web solo funciona en desktop, estás filtrando a más de la mitad del público.
- Es lo primero que el profesor/reclutador abre desde el móvil cuando le mandas el link. Primera impresión.

### Cómo lo arreglas

**Mobile-first con breakpoints mínimos.** En tu `_custom_properties.scss` define los breakpoints como variables:

```scss
// No en :root sino en una variable SCSS (las CSS custom properties no funcionan en @media)
$bp-tablet: 768px;
$bp-desktop: 1024px;
$bp-wide: 1280px;
```

Y en `login-page.scss`:

```scss
.login-page {
  display: flex;
  flex-direction: column;  // móvil: columna
  padding: var(--space-m);
}

.login-page__info,
.login-page__form-section {
  width: 100%;
  padding: var(--space-l);  // móvil: padding razonable
}

@media (min-width: $bp-tablet) {
  .login-page {
    flex-direction: row;
  }
  .login-page__info { width: 50%; }
  .login-page__form-section {
    width: 50%;
    padding: 0 var(--space-xl);
  }
}

@media (min-width: $bp-desktop) {
  .login-page__form-section {
    padding: 0 var(--space-xxxl);
  }
}
```

Para el grid del directorio, **CSS Grid con `auto-fill` + `minmax` te regala responsive sin media queries**:

```scss
.cards__container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--space-l);
}
.anime__card {
  width: auto;  // fuera el 18% fijo
}
```

### 💡 Aprendizaje

**"Mobile-first" no es una moda, es matemática:** la mayoría del tráfico está en móvil, y es más fácil añadir complejidad al crecer que reducirla al encoger. Empieza el CSS con el layout móvil (una columna, padding pequeño) y usa `@media (min-width: ...)` para añadir la versión tablet/desktop.

---

## 9. Sin estilos de `:focus`: el usuario de teclado va a ciegas

### Qué pasa

En `_reset.scss`:

```scss
input, button, textarea, select {
  font: inherit;
  border: none;
  outline: none;  // ← esto
  background: none;
}
```

Estás quitando el outline de todos los elementos focusables. Y **no has añadido nada que lo reemplace**. No hay un solo `:focus` ni `:focus-visible` en todo tu CSS.

### Por qué importa

- Prueba a cargar tu app y pulsar `Tab` repetidamente sin mover el ratón. **¿Sabes dónde estás?** No, porque no hay feedback visual. Para cualquiera que navegue con teclado (por costumbre, por discapacidad motora, o porque no hay ratón), tu web es un laberinto a ciegas.
- **WCAG 2.2 criterio 2.4.7 (Focus Visible)** es obligatorio en nivel AA. Sin focus styles, la accesibilidad se tacha.

### Cómo lo arreglas

**Nunca quites `outline` sin dar alternativa.** En `_base.scss`:

```scss
button, a, input, select, textarea, [tabindex] {
  &:focus-visible {
    outline: 2px solid var(--color-red-primary);
    outline-offset: 2px;
    border-radius: var(--border-radius-xs);  // opcional, más bonito
  }
}
```

`:focus-visible` es clave: solo muestra el outline cuando el usuario llega por **teclado**, no cuando hace clic (el outline al hacer clic sí molesta visualmente). Es lo que usan Google, GitHub, Figma.

Y si quieres mantener el `outline: none` por reset, hazlo condicional:

```scss
// En _reset.scss
input, button, textarea, select {
  font: inherit;
  border: none;
  background: none;

  &:focus {
    outline: none;  // solo para :focus "normal" (mouse)
  }
  &:focus-visible {
    outline: 2px solid var(--color-red-primary);
    outline-offset: 2px;
  }
}
```

### Aprendizaje

**`outline: none` sin reemplazo es el antipatrón de accesibilidad más común del mundo.** Nunca lo dejes solo. La regla es: si quitas el outline default, siempre, siempre añade un `:focus-visible` alternativo. Es literalmente obligatorio por ley en muchas webs (WCAG AA).

---

## 10. Contraste de colores insuficiente en texto pequeño

### Qué pasa

Lighthouse marca `color-contrast` como 0%. Los elementos señalados:

- El `<input class="buscar__anime">` del menú (texto blanco sobre `blanchedalmond` que es crema claro).
- Los botones `.btn__disable` (texto blanco sobre gris).
- Variables `--color-white-50` (`#ffffff8b`, ~55% alpha) usadas para:
  - `.login-page__form-separation-text` (la "o" entre divisores)
  - `.login-page__form-forget` ("Forget your password?")
  - `.login-page__form-sing-up` ("You don't have account?")

Blanco al 55% sobre fondo oscuro da ~3.5:1 de contraste, WCAG AA pide **4.5:1 para texto normal**.

### Por qué importa

- Bajo sol directo en el móvil, texto blanco al 50% es invisible.
- Personas con **presbicia**, **cataratas incipientes** o **daltonismo de bajo contraste** no lo leen.
- Google penaliza en ranking por Core Web Vitals + a11y.

### Cómo lo arreglas

**Cambia los colores con más transparencia por los más sólidos en texto:**

```scss
// Antes (contraste insuficiente)
.login-page__form-forget {
  color: var(--color-white-50);
}

// Después
.login-page__form-forget {
  color: var(--color-white-75);  // que ya tienes definido, 78% alpha
}
```

Para el `.buscar__anime` en la barra superior:

```scss
// App.scss, quita el blanchedalmond (y ya de paso no hardcodees color names)
.menu {
  background-color: var(--color-black-bg);  // fondo oscuro → input blanco se ve bien
}
.buscar__anime {
  color: var(--color-white);  // ya estaba, pero ahora el fondo lo respalda
}
```

Herramienta para verificar: **[WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)**, pegas dos hex y te dice si pasa AA/AAA.

### 💡 Aprendizaje

**Texto con alpha < 75% sobre fondo de color suele fallar WCAG.** Regla práctica: texto blanco sobre fondo oscuro → mínimo `#FFFFFFC7` (75% alpha). Texto negro sobre fondo claro → `#000000C7` mínimo. Si bajas de ahí, verifícalo siempre con un contrast checker antes de dejarlo.

---

## 11. Build warning: bundle de 578 kB y assets sin optimizar

### Qué pasa

`npm run build` termina bien pero con esto:

```
dist/assets/Inter-FIwubZjA.woff2        349.42 kB
dist/assets/Inter-c8O0ljhh.ttf          874.71 kB   ← duplicado del woff2
dist/assets/fondo_singUp-DzHfjGG_.jpg   421.31 kB
dist/assets/fondo_login-DI9GhCJK.jpg    335.86 kB
dist/assets/index-8MdWv7PE.js           578.68 kB   ← ⚠️ >500kB

(!) Some chunks are larger than 500 kB after minification.
```

Tres problemas:

1. **Envías tanto `Inter.woff2` como `Inter.ttf`**, 874 kB de TTF extra que nunca se va a descargar (el navegador usa woff2).
2. **Las fotos de fondo son JPG gigantes sin optimizar.** JPG vs WebP para estos fondos: ~60% menos peso. Vs AVIF: ~75% menos.
3. **Todo el JS en un único chunk** de 579 kB. Firebase + react-router + react-hook-form + sileo en la misma descarga inicial, aunque el usuario solo quiera ver la Directory sin loguearse.

### Por qué importa

- En 4G típico, **1 MB extra = 1-2 segundos más** de First Contentful Paint.
- En conexiones por datos (México rural, India, etc.), **878 kB de fuente innecesaria es un lujo**.
- Move a WebP/AVIF es el cambio con mejor ratio esfuerzo/impacto en performance.

### Cómo lo arreglas

**1. Borra el TTF.** Con woff2 + fallback a sans-serif ya cubres el 99% de navegadores (woff2 está soportado desde 2016 en todo lo que respira).

```scss
// _fonts.scss, quita el .ttf
@font-face {
  font-family: "Inter";
  src: url("../../assets/fonts/Inter.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

**2. Convierte las fotos a WebP.** Usa [squoosh.app](https://squoosh.app) (drag and drop, exporta webp al 80% de calidad):

```scss
// login-page.scss
background-image:
  linear-gradient(to top, rgba(0,0,0,.7), rgba(0,0,0,0)),
  url(../../assets/images/fondo_login.webp);  // .jpg → .webp
```

Si quieres fallback, `<picture>` es la herramienta, pero en CSS con `image-set()`:

```scss
background-image:
  linear-gradient(to top, rgba(0,0,0,.7), rgba(0,0,0,0)),
  image-set(
    url(../../assets/images/fondo_login.avif) type("image/avif"),
    url(../../assets/images/fondo_login.webp) type("image/webp"),
    url(../../assets/images/fondo_login.jpg) type("image/jpeg")
  );
```

**3. Code-splitting por ruta** (esto ya es React, pero afecta al HTML/CSS que llega al usuario):

```tsx
// main.tsx
import { lazy, Suspense } from 'react';
const LoginPage = lazy(() => import('./view/login/LoginPage'));
const RegisterPage = lazy(() => import('./view/register/RegisterPage'));

// en el router:
{ path: '/login', element: <Suspense fallback={<LoadingComponent text="..." />}><LoginPage/></Suspense> }
```

Firebase solo se descarga cuando entras en login/register → bundle inicial mucho menor.

### Aprendizaje

**El archivo más rápido es el que no se descarga.** Antes de optimizar código, revisa qué estás sirviendo. Cada kB que el usuario no necesita es un kB de experiencia que le estás quitando. En orden: elimina lo innecesario → comprime lo necesario → diferir lo que no es crítico.

---

## 12. `src/index.css` anula estilos del reset

### Qué pasa

Tu `src/index.css` tiene:

```css
*{
    border: none;
}
```

Y en `_base.scss` después:

```scss
input {
  border: 1px solid var(--color-white);
  ...
}
```

El orden de import en `main.tsx` es `index.css` primero, pero la especificidad de `*` es menor que un selector de elemento, así que `input` *sí* tiene borde. Pero en los casos donde usas `.anime__card { border: 2px solid black; }` el selector `*` lo pierde por especificidad también, o sea, funciona por accidente.

### Por qué importa

Tienes **dos sistemas de reset peleándose:** `_reset.scss` (estructurado, con target a elementos específicos) y `index.css` (un `* { border: none }` suelto). En cuanto alguien añada un caso borderline, hay bugs de CSS difíciles de debuggear.

### Cómo lo arreglas

Borra `src/index.css` entero. Ya tienes un reset completo en `src/scss/base/_reset.scss` importado desde `App.scss`. Uno y solo uno.

```tsx
// main.tsx
import './index.css'  // ← quita esta línea
```

O deja `index.css` solo para variables de nivel documento (preferencia de esquema dark, `html { color-scheme: dark; }`, etc.).

### 💡 Aprendizaje

**Un proyecto, un reset CSS.** Si empiezas a tener "reglas globales" en dos archivos, en algún momento van a chocar. Concentra las reglas base en un único sitio (`_reset.scss`) y trata los `.css/.scss` de componentes como aditivos, nunca normativos.

---

## 13. Error de sintaxis CSS en el `body`

### Qué pasa

En `_base.scss`:

```scss
body {
  background: linear-gradient(
    130deg,
    var(--color-black-bg) 0%,
    var(--color-black-bg) 70%,
    var(--color-red-bg) 100%,    ← coma final dentro de linear-gradient()
  );
  ...
}
```

Esa coma después del `100%` es ilegal dentro de `linear-gradient()`. Los navegadores modernos están perdonando, pero estás dependiendo de su "modo tolerante".

### Cómo lo arreglas

```scss
body {
  background: linear-gradient(
    130deg,
    var(--color-black-bg) 0%,
    var(--color-black-bg) 70%,
    var(--color-red-bg) 100%
  );  // sin coma antes del )
}
```

### 💡 Aprendizaje

**Las comas finales en CSS dependen del contexto.** Son válidas entre valores de una propiedad (p. ej. `font-family: "Inter", "Arial",`, aunque feo, legal) pero **no dentro de funciones** como `rgb()`, `linear-gradient()`, `calc()`. Cuando veas un comportamiento raro de CSS que debería funcionar, abre DevTools > Styles y mira si el valor aparece tachado en rojo (= ignorado).

---

## 14. `100vh` en móvil: tu layout es más grande que la pantalla

### Qué pasa

Estos selectores usan `100vh`:

```scss
.login-page     { height: calc(100vh - 50px); }
.register-page  { height: calc(100vh - 50px); }
.anime-page     { height: calc(100vh - 50px); }
```

### Por qué importa

En **Safari iOS y Chrome Android**, `100vh` incluye la barra de direcciones del navegador, que aparece y desaparece al scrollear. Resultado: cuando la barra está visible, tu página tiene ~100 px extra y aparece scroll vertical aunque no lo quieras. Cuando se oculta, el layout salta.

### Cómo lo arreglas

Usa las unidades nuevas de viewport:

```scss
.login-page {
  min-height: 100dvh;  // "dynamic", se ajusta al viewport actual
  // fallback para navegadores viejos:
  min-height: 100vh;
  min-height: 100dvh;  // el segundo gana si el browser lo entiende
}
```

Fuerza `min-height` en vez de `height`, si el contenido crece (errores de validación, texto más largo por i18n), no queda recortado.

### 💡 Aprendizaje

**`100vh` en móvil es siempre un problema.** La especificación CSS añadió `dvh` (dynamic), `svh` (small, como si la barra estuviera siempre), y `lvh` (large, sin la barra) para resolver esto. Regla: en desktop `100vh` sirve, en móvil siempre `100dvh`.

---

## 15. Dependencias con vulnerabilidades (1 critical, 3 high)

### Qué pasa

`npm audit` reporta:

| Paquete | Severidad | Origen |
|---|---|---|
| protobufjs | **critical** | Firebase (transitiva) |
| vite | **high** | Directa |
| flatted | **high** | ESLint (transitiva) |
| picomatch | **high** | Vite (transitiva) |
| brace-expansion | moderate | Node / ESLint |

### Por qué importa

En dev local no te afecta mucho (nadie puede atacar tu localhost), pero:

- **Vite tiene 3 CVEs que permiten leer archivos arbitrarios del sistema por WebSocket.** Si alguna vez corres el dev server con `--host` expuesto en red local, cualquiera en la misma WiFi puede leer tus archivos.
- **protobufjs critical (Firebase)**: arbitrary code execution. Afecta en producción si la librería se usa con input no confiable.

### Cómo lo arreglas

```bash
npm audit fix
```

Si no funciona limpio (a veces toca `npm audit fix --force` y leer el breaking changes):

```bash
npm update vite firebase   # prueba actualizar primero sin force
npm audit
```

Y añade un paso de CI/CD que corra `npm audit --audit-level=high` y falle el build si hay algo.

### 💡 Aprendizaje

**`npm audit` es tu primer chequeo de salud antes de cada push.** Las dependencias no son "código de otros", cuando las instalas, son **código tuyo**. Las vulnerabilidades transitivas (las que entran por tus dependencias) representan >80% de los CVEs en proyectos JS. Revísalas semanalmente.

---

## 📋 Plan de acción sugerido

No tienes que hacerlo todo de golpe. Victorias progresivas:

### Victorias rápidas

> *Son los cambios más baratos y los que más mueven la aguja en Lighthouse.*

- [ ] Cambiar `<html lang="en">` → `lang="es"` **(30 seg, 1 punto SEO/a11y)**
- [ ] Rellenar `<head>`: `title` descriptivo + `meta description` + favicon propio **(15 min)**
- [ ] Añadir `alt` a las 5 imágenes que faltan en `DirectoryPage`, `SearchResultsPage`, `SearchAnimeComponent`, `AnimePage` **(10 min)**
- [ ] Eliminar `<img src="#">` de `LoadingComponent`, `ErrorComponent` y `LoginPage` **(15 min)**
- [ ] Arreglar coma final de `linear-gradient` en `_base.scss` **(1 min)**
- [ ] `npm audit fix` **(2 min)**
- [ ] Borrar `src/index.css` (el reset global `*{border:none}`) **(2 min)**

### Accesibilidad y estructura

> *Pulido serio. Aquí es donde la web deja de ser "funciona" y empieza a ser "está bien hecha".*

- [ ] Reescribir headings: un `h1` por página, resto como `h2`/`h3` **(1 tarde)**
- [ ] Convertir tarjetas `<div onClick>` en `<Link>` (DirectoryPage + SearchResultsPage + SearchAnimeComponent) **(1 tarde)**
- [ ] Conectar todos los `<label>` con sus `<input>` (envolver o `htmlFor` + `id`) **(1 tarde)**
- [ ] Añadir `:focus-visible` a botones/enlaces/inputs en `_base.scss` **(30 min)**
- [ ] Subir los textos con `--color-white-50` a `--color-white-75` **(30 min)**
- [ ] Dar `width`/`height` a todas las `<img>` o usar `aspect-ratio` en CSS **(1 tarde)**, esto solo bajará tu CLS de 0.23 a ~0.05

### Responsive y performance

> *El trabajo fino que ya es nivel de portfolio.*

- [ ] Breakpoints SCSS + `@media (min-width: ...)` en login, register, anime-page y directory **(2 tardes)**
- [ ] Reemplazar `.anime__card { width: 18% }` por `grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))` **(30 min)**
- [ ] `100vh` → `100dvh` con fallback **(30 min)**
- [ ] Borrar `Inter.ttf` de `_fonts.scss`, quedarte solo con woff2 **(5 min)**
- [ ] Convertir `fondo_login.jpg` y `fondo_singUp.jpg` a WebP/AVIF con squoosh.app **(30 min)**
- [ ] `loading="lazy"` en imágenes del directorio **(15 min)**
- [ ] Code-splitting con `lazy()` en rutas de login/register/anime **(1 tarde)**

Haz la auditoría otra vez al final de cada semana y compara scores. Tu objetivo razonable:

| Métrica | Hoy | Fin Semana 1 | Fin Semana 2 | Fin Semana 3 |
|---|---|---|---|---|
| Accesibilidad | 81 | 90 | 98 | 100 |
| Best Practices | 77 | 92 | 96 | 100 |
| SEO | 75 | 92 | 100 | 100 |
| CLS | 0.23 | 0.23 | **0.05** | **< 0.05** |

---

## 🎓 Recursos para profundizar

- **[web.dev/learn/html](https://web.dev/learn/html/)**, curso de HTML moderno hecho por Google. Gratis. Cada capítulo son 15 min.
- **[web.dev/learn/css](https://web.dev/learn/css/)**, el equivalente para CSS. Incluye flexbox, grid, custom properties, y **sub-pixel rendering**.
- **[web.dev/learn/performance](https://web.dev/learn/performance/)**, Core Web Vitals explicados con ejemplos.
- **[WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)**, la especificación oficial de accesibilidad. Filtras por nivel AA y te sale la checklist exacta.
- **[WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)**, verificador de contraste de dos colores. Bookmarkealo.
- **[axe DevTools (Chrome extension)](https://chrome.google.com/webstore/detail/axe-devtools/lhdoppojpmngadmnindnejefpokejbdd)**, auditoría de a11y dentro de DevTools. Más detallada que Lighthouse en accesibilidad.
- **[Every Layout (rachelandrew / heydon)](https://every-layout.dev/)**, patrones de CSS layout que se adaptan sin media queries. Te cambia la forma de pensar en responsive.
- **[squoosh.app](https://squoosh.app)**, compresor de imágenes de Google. WebP, AVIF, JPEG XL, con comparador lado a lado.
- **[html5-accessibility.com](https://html5accessibility.com/)**, qué elementos HTML son accesibles nativamente. Te ayuda a elegir el tag correcto.

---

## ✨ Cierre

Tienes una **base más sólida de lo que un proyecto de estudiante suele tener**: design tokens bien pensados, arquitectura SCSS limpia, componentes separados, TypeScript tipado, integración con Firebase funcionando, validación de formularios hecha con buenas herramientas. Ese es el trabajo de fondo que ya está.

Lo que queda, `lang`, headings, alt, focus, CLS, responsive, son **detalles de superficie**. Ninguno requiere refactorizar nada de lo que has construido. Es pulir lo que ya está, no rehacer.

Cuando termines la Semana 3 y mires tu Lighthouse en verde, vas a tener un proyecto que cualquier empresa se puede mirar tranquila. Y más importante: vas a saber **por qué** está en verde, cada regla que has aplicado la entiendes, no es magia.

La diferencia entre "hacer una web" y "hacer una web bien" son exactamente estos detalles. Tú ya estás al 80%. El 20% que queda es donde se nota el oficio.

Ánimo, y cuando tengas dudas aplicando los fixes, pregunta, el reporte te dice *qué* y *por qué*, pero implementar cada cosa tiene sus decisiones propias.

---

🎌
