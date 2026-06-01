# CLAUDE.md — Plan maestro proyecto Toromac

> Este archivo es la fuente de verdad del proyecto. Lee todo el contenido antes de escribir una sola línea de código. Sigue las instrucciones al pie de la letra.

---

## 1. Descripción del proyecto

**Cliente:** Toromac — Toro Maquinaria Industria Alimentaria  
**Web:** toromac.com  
**Objetivo:** Web corporativa bilingüe (ES + EN) para empresa fabricante de maquinaria industrial, con catálogo de productos, blog SEO automatizado vía n8n y formularios de contacto y presupuesto funcionales.

**Referencia de contenido y productos:** https://marobera.com/ — se toman los mismos productos, servicios, sectores y estructura de comunicación. El diseño y branding son completamente propios de Toromac (no imitar el diseño de Marobera).

---

## 2. Identidad de empresa

| Campo | Valor |
|---|---|
| Nombre | Toromac / Toro Maquinaria Industria Alimentaria |
| Experiencia | +40 años en el sector |
| Perfil | Equipo de profesionales de alto nivel especializados en fabricación de maquinaria industrial |
| Imagen de marca | Moderna, fluida, seria — tecnología e ingeniería de alto nivel |
| Tono editorial | Técnico, clínico, directo. **Sin lenguaje emocional, sensorial ni retórico.** |

### Sectores en los que trabaja Toromac

- **Industria Alimentaria:** Snacks, Cereales, Frutos secos, Congelados, Ingredientes en polvo
- **Industria farmacéutica y nutracéutica:** Polvos sensibles, Manipulación higiénica, Acabados sanitarios 304L / 316L
- **Industria química:** Productos granulados, Manipulación controlada, Opciones ATEX bajo demanda
- **Nutrición animal:** Transporte eficiente de producto, Minimización de roturas

### Clientes de referencia (mostrar logos en la web)

Gallo (Pastas), BFR Groupe / Latinpack, Grefusa, Radar Process, Oromas, Rovema, ULMA, Realplast, Chupa Chups, MIPCRE

---

## 3. Stack técnico

### Frontend
- **React 18** + **Vite 5** — scaffold base, build optimizado
- **React Router v6** — routing con prefijo `/en/` para versión inglesa
- **Tailwind CSS v3** — design system, purging automático en build
- **i18next** + **react-i18next** — sistema de traducciones JSON, lazy loading por idioma
- **React Helmet Async** — meta tags, Open Graph, hreflang, JSON-LD schema.org por ruta
- **React Hook Form** + **Zod** — formularios con validación tipada cliente y servidor
- **Framer Motion** — animaciones de entrada en scroll, lazy-loaded
- **Lucide React** — iconos tree-shakeable

### Backend / Serverless (Vercel Functions)
- **Resend SDK** — envío de emails desde funciones serverless
- `api/contact.js` — recibe formulario de contacto → Resend → email destino
- `api/quote.js` — recibe formulario presupuesto multi-step → Resend → email con datos completos del lead
- `api/publish-article.js` — endpoint protegido con Bearer token que recibe artículos de n8n, hace commit en GitHub vía GitHub API → Vercel detecta push → build automático (~30s) → artículo live

### SEO
- **vite-plugin-sitemap** — sitemap.xml bilingüe automático en cada build
- Schema.org JSON-LD: Organization, Product, Article, BreadcrumbList, FAQPage
- hreflang `es` / `en` / `x-default` en todas las páginas
- Meta title + description únicos por ruta y por idioma vía i18next

### Despliegue
- **Vercel** — Edge Network global, HTTP/2, Brotli, SSL automático, preview deployments
- Dominio: `toromac.com` conectado en Vercel
- Variables de entorno gestionadas en el dashboard de Vercel

---

## 4. Variables de entorno

Crear archivo `.env.local` para desarrollo. En producción, configurar en Vercel Dashboard.

```
RESEND_API_KEY=re_xxxx
CONTACT_EMAIL=jtoro@marobera.com
GITHUB_TOKEN=ghp_xxxx        # Personal Access Token con permisos repo (write)
GITHUB_REPO=usuario/toromac  # Reemplazar con el repo real
PUBLISH_SECRET=xxxx          # Token Bearer para autenticar peticiones de n8n
VITE_GA_ID=G-XXXXXXXXXX      # Google Analytics 4 Measurement ID
```

> **CONTACT_EMAIL** es provisional. Se actualizará cuando Toromac tenga email propio.

---

## 5. Arquitectura bilingüe ES / EN

### Idiomas soportados
- **Español (es):** rutas sin prefijo → `/`, `/productos/`, `/novedades/`, etc.
- **Inglés (en):** rutas con prefijo `/en/` → `/en/`, `/en/products/`, `/en/news/`, etc.

### Implementación
- i18next con archivos `src/locales/es.json` y `src/locales/en.json`
- Detección automática del idioma del navegador al primer acceso
- Idioma persistido en `localStorage`
- Selector de idioma en la navbar: flag + código (`🇪🇸 ES` / `🇬🇧 EN`), dropdown minimalista
- Slugs de productos y artículos traducidos manualmente (no transliteración automática)
- Canonical correcto por idioma, sin duplicados cross-idioma

### Selector de idioma (referencia de comportamiento)
Igual al de https://marobera.com/en/ — al cambiar idioma, navega a la URL equivalente en el otro idioma.

---

## 6. Arquitectura de páginas

### Páginas en español (`/`)

| Página | Ruta | Descripción |
|---|---|---|
| Inicio | `/` | Hero, stats, productos destacados, sectores, logos clientes, CTA, preview blog |
| Productos | `/productos/` | Catálogo filtrable por categoría + 26 fichas individuales |
| Compañía | `/compania/` | Historia, equipo, sectores, clientes, filosofía |
| Novedades | `/novedades/` | Blog SEO — listado + artículo individual |
| Contacto | `/contacto/` | Formulario simple + datos de contacto |
| Presupuesto | `/presupuesto/` | Formulario multi-step cualificador |

### Páginas en inglés (`/en/`)

| Página | Ruta | Descripción |
|---|---|---|
| Home | `/en/` | Versión EN de Home |
| Products | `/en/products/` | Versión EN del catálogo |
| Company | `/en/company/` | Versión EN de Compañía |
| News | `/en/news/` | Blog EN — artículos generados en inglés por n8n |
| Contact | `/en/contact/` | Versión EN de Contacto |
| Quote | `/en/quote/` | Versión EN de Presupuesto |

### Páginas de producto individuales (ejemplos de slug)
- ES: `/productos/elevador-cangilones-tipo-z/`
- EN: `/en/products/z-type-bucket-elevator/`

---

## 7. Catálogo de productos

Los datos de cada producto se almacenan en `src/data/products/` como archivos JSON.

### Categorías y productos

#### Elevación y transporte (7 productos)
1. Elevador de cangilones Tipo Z — producto estrella
2. Elevador de cangilones Tipo C
3. Elevador de cangilones Tipo O
4. Elevador de cangilones Móvil
5. Elevador de banda Tipo Z
6. Elevador Sin-Fin (tornillo sinfín)
7. Cinta Transportadora de Banda Industrial

#### Recambios y cangilones (8 productos)
8. Cangilón CALYON Natural 2L
9. Cangilón CALYON Natural 5L
10. Cangilón CALYON Natural 7L
11. Cangilón CALYON Natural 10L
12. Cangilón CALYON X Metal-Detectable 2L
13. Cangilón CALYON X Metal-Detectable 5L
14. Cangilón CALYON X Metal-Detectable 7L
15. Cangilón CALYON X Metal-Detectable 10L

#### Equipos de procesado (6 productos)
16. Tamizadora Centrífuga TC400
17. Tamizadora Centrífuga TC650
18. Tamizadora Centrífuga TC800
19. Tamizadora Centrífuga TC1000
20. Freidora Industrial de Acero Inoxidable
21. Caldera Volcable

#### Dosificación y almacenaje (3 productos)
22. Soporte para Big Bags
23. Alimentador de Silos Industrial
24. Depósito de Agua Purificada

#### Otros (2 productos)
25. Canal de Alimentación Vibrada
26. Filtro Ciclónico

### Estructura JSON de un producto

```json
{
  "id": "elevador-cangilones-tipo-z",
  "slug": {
    "es": "elevador-cangilones-tipo-z",
    "en": "z-type-bucket-elevator"
  },
  "category": "elevacion-transporte",
  "featured": true,
  "name": {
    "es": "Elevador de Cangilones Tipo Z",
    "en": "Z-Type Bucket Elevator"
  },
  "shortDescription": {
    "es": "Solución de elevación compacta para productos sólidos y granulados.",
    "en": "Compact elevation solution for solid and granular products."
  },
  "description": {
    "es": "Descripción completa en español...",
    "en": "Full description in English..."
  },
  "specs": [
    { "label": { "es": "Capacidad", "en": "Capacity" }, "value": "Hasta 50m³/h" },
    { "label": { "es": "Material", "en": "Material" }, "value": "Acero inoxidable 304L / 316L" }
  ],
  "highlights": {
    "es": ["Ocupación de espacio reducida", "Mínimo consumo energético", "Cuidado máximo del producto"],
    "en": ["Reduced footprint", "Minimum energy consumption", "Maximum product care"]
  },
  "image": "/images/products/elevador-cangilones-tipo-z.jpg",
  "imageAlt": {
    "es": "Elevador de cangilones tipo Z para transporte industrial",
    "en": "Z-type bucket elevator for industrial transport"
  },
  "seo": {
    "es": {
      "title": "Elevador de Cangilones Tipo Z Industrial | Toromac",
      "description": "Fabricantes de elevadores de cangilones tipo Z. Hasta 50m³/h, acero inoxidable, bajo consumo. Soluciones a medida para alimentación, química y farma."
    },
    "en": {
      "title": "Z-Type Bucket Elevator Industrial | Toromac",
      "description": "Manufacturers of Z-type bucket elevators. Up to 50m³/h, stainless steel, low energy. Custom solutions for food, chemical and pharma industries."
    }
  }
}
```

---

## 8. Sistema de artículos / blog

Los artículos se almacenan en `src/data/articles/es/[slug].json` y `src/data/articles/en/[slug-en].json`.

### Estructura JSON de un artículo

```json
{
  "id": "guia-tipos-cangilones-elevadores",
  "slug": {
    "es": "guia-tipos-cangilones-elevadores",
    "en": "guide-types-bucket-elevators"
  },
  "publishedAt": "2025-11-21T14:58:38Z",
  "updatedAt": "2026-04-20T12:21:23Z",
  "lang": "es",
  "author": "Equipo Toromac",
  "category": "elevacion-transporte",
  "relatedProduct": "elevador-cangilones-tipo-z",
  "title": {
    "es": "Guía Completa sobre Tipos de Cangilones para Elevadores",
    "en": "Complete Guide to Bucket Types for Elevators"
  },
  "metaDescription": {
    "es": "Explora los tipos de cangilones para elevadores. Una guía técnica para ingenieros de proceso y responsables de planta.",
    "en": "Explore bucket types for elevators. A technical guide for process engineers and plant managers."
  },
  "heroImage": "/images/articles/guia-tipos-cangilones.jpg",
  "heroImageAlt": {
    "es": "Tipos de cangilones para elevadores industriales",
    "en": "Bucket types for industrial elevators"
  },
  "content": {
    "es": "Contenido HTML o Markdown del artículo en español...",
    "en": "Full article content in English..."
  },
  "faq": [
    {
      "question": { "es": "¿Qué capacidad puede manejar un cangilón?", "en": "What capacity can a bucket handle?" },
      "answer": { "es": "Depende del tamaño y material...", "en": "It depends on size and material..." }
    }
  ],
  "tags": {
    "es": ["cangilones", "elevadores", "elevador de cangilones"],
    "en": ["buckets", "elevators", "bucket elevator"]
  }
}
```

### Cómo añadir un artículo manualmente (checklist)
- [ ] Crear archivo `src/data/articles/es/[slug-es].json`
- [ ] Crear archivo `src/data/articles/en/[slug-en].json`
- [ ] Verificar que el slug no existe ya
- [ ] Incluir `faq` con mínimo 5 preguntas
- [ ] Verificar que `relatedProduct` apunta a un ID de producto existente
- [ ] Hacer `git push` → Vercel build automático

---

## 9. Diseño y branding

### Paleta de colores

```
--color-black:      #0A0A0A   (fondos oscuros, texto principal)
--color-blue:       #2B4FBF   (color principal Toromac, CTAs, acentos)
--color-blue-light: #3D63D6   (hover estados)
--color-blue-dark:  #1E3A8A   (active estados)
--color-gray-cold:  #F4F4F6   (fondos sección alternada clara)
--color-gray-mid:   #6B7280   (texto secundario)
--color-white:      #FFFFFF
```

### Tipografía

```
--font-heading: 'Inter', 'Manrope', sans-serif   (weight: 700/800)
--font-body:    'Inter', sans-serif               (weight: 400/500)
```

Cargar Inter desde Google Fonts con `preconnect` y `display=swap`.

### Componentes de diseño

**Hero (página de inicio):**
- Fondo oscuro (`#0A0A0A`)
- Logo/cabeza de toro como elemento gráfico oversized en el fondo (opacity baja)
- Claim principal en blanco, tipografía grande, sin retórica emocional
- Dos CTAs: primario azul sólido + secundario outline blanco
- Vídeo de loop en background O imagen de producto con overlay oscuro

**Tarjetas de producto:**
- Fondo blanco, borde completo `1px solid #E5E7EB`
- En hover: `border-left: 3px solid #2B4FBF`, sombra sutil, imagen con zoom suave
- Categoría como badge pequeño, nombre en bold, descripción corta, botón "Ver más"

**Secciones:**
- Alternancia: blanco / gris frío (`#F4F4F6`) / negro — nunca dos oscuras seguidas
- Padding generoso: `py-20` a `py-28`
- Max-width del contenido: `max-w-7xl mx-auto`

**CTAs:**
- Primario: `bg-blue-700 text-white hover:bg-blue-800 px-6 py-3 rounded-lg font-medium`
- Secundario: `border border-white text-white hover:bg-white hover:text-black`

**Animaciones (Framer Motion):**
- `fadeInUp` en scroll para secciones y cards
- Duración: 0.4s, ease-out
- Sin paralaje, sin partículas, sin efectos recargados

**Selector de idioma en navbar:**
- Dropdown mínimo: flag emoji + código de idioma
- Alineado a la derecha del nav, antes del CTA de presupuesto

### Imágenes
- Placeholder: imágenes de Marobera (reemplazar progresivamente con fotos propias)
- Formato: WebP con fallback JPEG
- Atributos `width` y `height` siempre declarados (evitar layout shift)
- Lazy loading nativo: `loading="lazy"` excepto hero (eager)
- Almacenar en `public/images/products/` y `public/images/articles/`

---

## 10. Formularios

### Formulario de contacto simple
**Campos:** Nombre, Email, Teléfono, Mensaje, checkbox aceptación legal  
**Destino:** `api/contact.js` → Resend → `CONTACT_EMAIL`  
**Email recibido:** incluir todos los campos con formato HTML limpio  
**Respuesta al usuario:** mensaje de confirmación en pantalla (no redirigir)

### Formulario de presupuesto (multi-step)
**Step 1 — Producto de interés:**
- Selector de categoría + selector de producto (dependiente)

**Step 2 — Aplicación:**
- Sector (dropdown: Alimentaria, Farmacéutica, Química, Nutrición animal, Otro)
- Tipo de producto a transportar (texto libre)
- Capacidad necesaria (texto libre o selector de rangos)

**Step 3 — Datos de contacto:**
- Nombre, Empresa, Email, Teléfono, País
- Mensaje adicional (opcional)
- Checkbox aceptación legal

**Email recibido en `CONTACT_EMAIL`:**
- Template HTML con todos los datos estructurados por sección
- Asunto: `[Toromac] Nuevo presupuesto — [Nombre] · [Empresa]`
- Marcar claramente producto de interés y sector

---

## 11. SEO — estrategia de keywords

### Keywords primarias ES (páginas de producto)
Estas keywords deben aparecer en title, H1, meta description y de forma natural en el contenido de las fichas de producto correspondientes:

| Keyword | Página objetivo |
|---|---|
| cinta transportadora | `/productos/cinta-transportadora-banda/` |
| cinta transportadora industrial | `/productos/cinta-transportadora-banda/` |
| elevador de cangilones | `/productos/elevador-cangilones-tipo-z/` |
| cangilones / cangilón | `/productos/` + fichas individuales |
| cangilones para elevadores | `/productos/elevador-cangilones-tipo-z/` |
| tornillo sin fin elevador | `/productos/elevador-sinfin/` |
| elevador tipo z / elevador z | `/productos/elevador-cangilones-tipo-z/` |
| tamizadora industrial / tamiz centrífugo | `/productos/tamizadora-centrifuga-tc1000/` |
| soporte big bag | `/productos/soporte-big-bags/` |
| banda elevadora de cangilones | `/productos/elevador-banda-tipo-z/` |

### Keywords primarias EN (páginas de producto en inglés)
| Keyword | Página objetivo |
|---|---|
| z bucket elevator | `/en/products/z-type-bucket-elevator/` |
| bucket elevator type z | `/en/products/z-type-bucket-elevator/` |
| industrial conveyor belt | `/en/products/industrial-belt-conveyor/` |
| portable bucket elevator | `/en/products/mobile-bucket-elevator/` |
| z-type bucket elevator | `/en/products/z-type-bucket-elevator/` |
| centrifugal sifter industrial | `/en/products/centrifugal-sifter-tc1000/` |
| mobile bucket elevator | `/en/products/mobile-bucket-elevator/` |
| screw conveyor elevator | `/en/products/screw-conveyor-elevator/` |

### Implementación técnica SEO obligatoria

Cada página debe incluir vía `React Helmet Async`:

```jsx
// Ejemplo para producto en ES
<Helmet>
  <title>Elevador de Cangilones Tipo Z Industrial | Toromac</title>
  <meta name="description" content="Fabricantes de elevadores de cangilones tipo Z..." />
  <link rel="canonical" href="https://toromac.com/productos/elevador-cangilones-tipo-z/" />
  <link rel="alternate" hreflang="es" href="https://toromac.com/productos/elevador-cangilones-tipo-z/" />
  <link rel="alternate" hreflang="en" href="https://toromac.com/en/products/z-type-bucket-elevator/" />
  <link rel="alternate" hreflang="x-default" href="https://toromac.com/productos/elevador-cangilones-tipo-z/" />
  <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
</Helmet>
```

Schema JSON-LD por tipo de página:
- **Home:** `Organization` + `WebSite`
- **Producto:** `Product` + `BreadcrumbList`
- **Artículo:** `Article` + `FAQPage` + `BreadcrumbList`
- **Contacto:** `LocalBusiness`

---

## 12. Flujo n8n — publicación automática de artículos

### Contexto
- n8n alojado en **Render** (self-hosted) — instancia existente
- Flujo nuevo desde cero — no hay workflow previo
- Genera **2 artículos por ejecución:** uno en ES y uno en EN
- Publica directamente en la web vía commit a GitHub → build Vercel automático

### Configuración del trigger
- **Tipo:** Cron
- **Frecuencia sugerida:** lunes y jueves a las 09:00 (2 artículos/semana → 8/mes por idioma)
- **Input:** Google Sheets con columnas: `keyword_es`, `keyword_en`, `producto_relacionado`, `prioridad`, `estado` (pendiente / publicado)

### Descripción de cada nodo

**Nodo 1 — Cron Trigger**
Lee la siguiente fila con `estado = pendiente` del Google Sheet.

**Nodo 2 — HTTP Request (Serper.dev)**
POST a `https://google.serper.dev/search` con header `X-API-KEY: {{$env.TOROMAC_SERPER_API_KEY}}` y body JSON `{"q":"{{keyword_es}}","gl":"es","hl":"es","num":10}`. Lee `organic[]` y extrae URLs de los 8–10 primeros resultados orgánicos.

**Nodo 3 — HTTP Request (fetch contenido competidores)**
Para cada URL, hace fetch del contenido. Extrae: estructura de H2/H3, longitud aproximada, preguntas PAA presentes, subtemas cubiertos.

**Nodo 4 — OpenAI GPT-4o-mini (brief)**
Prompt: genera un brief JSON con estructura del artículo ES (H1, H2s, H3s, longitud objetivo, ángulo diferenciador, 5 FAQs, CTA al producto `{{producto_relacionado}}`).

**Nodo 5 — Anthropic Claude Sonnet (redacción ES)**
Prompt completo de redacción. Instrucciones obligatorias:
- Mínimo 2.000 palabras
- H1 con la keyword exacta `{{keyword_es}}`
- Tono técnico-clínico, sin lenguaje emocional ni sensorial
- Incluir tabla comparativa técnica si aplica
- Incluir checklist si aplica
- Incluir sección FAQ con 5 preguntas y respuestas
- CTA inline natural al producto de Toromac relacionado
- No mencionar a competidores por nombre
- Responder únicamente con el JSON del artículo (sin markdown extra)

**Nodo 6 — Anthropic Claude Sonnet (redacción EN)**
Prompt: traducción y adaptación nativa al inglés del artículo ES. No es traducción literal. Ajustar keyword principal a `{{keyword_en}}`, slug, meta description y CTAs. Mismo nivel de profundidad y estructura.

**Nodo 7 — OpenAI GPT-4o-mini (revisión SEO)**
Comprueba ambos artículos:
- Keyword density 1–2%
- Meta description ≤ 160 caracteres
- H1 único
- Longitud ≥ 1.800 palabras
- FAQ presente con ≥ 5 preguntas
- Slug limpio (sin caracteres especiales)
Si algún campo falla: regenera solo ese campo y continúa.

**Nodo 8 — HTTP Request (endpoint Toromac)**
POST a `https://toromac.com/api/publish-article`  
Header: `Authorization: Bearer {{$env.TOROMAC_PUBLISH_SECRET}}`  
Body JSON:
```json
{
  "articleEs": { ...JSON artículo ES... },
  "articleEn": { ...JSON artículo EN... }
}
```

**Nodo 9 — Google Sheets (log)**
Actualiza la fila de la keyword: `estado = publicado`, `url_es`, `url_en`, `fecha_publicacion`, `palabras_es`, `palabras_en`.

**Nodo 10 — Send Email o Slack**
Notificación con los dos enlaces publicados para revisión manual opcional.

### Endpoint `api/publish-article.js` (Vercel)

Este endpoint recibe el POST de n8n, valida el Bearer token y hace commit de los dos archivos JSON en el repositorio GitHub usando la GitHub API. Vercel detecta el push y lanza build automático.

```js
// Lógica del endpoint
// 1. Verificar Authorization header === `Bearer ${process.env.PUBLISH_SECRET}`
// 2. Parsear body: { articleEs, articleEn }
// 3. Hacer PUT a GitHub API:
//    - /repos/{GITHUB_REPO}/contents/src/data/articles/es/{slug}.json
//    - /repos/{GITHUB_REPO}/contents/src/data/articles/en/{slug}.json
// 4. Retornar { success: true, urlEs, urlEn }
```

### Calidad editorial mínima por artículo
- ≥ 2.000 palabras
- ≥ 1 tabla comparativa técnica (cuando aplique)
- ≥ 5 preguntas FAQ con schema FAQPage
- 1 CTA claro al producto de Toromac más relevante
- Sin lenguaje emocional — solo datos técnicos y beneficios concretos
- Fuentes citadas cuando se usan datos específicos

---

## 13. Estructura de carpetas del repositorio

```
toromac/
├── public/
│   ├── robots.txt
│   ├── images/
│   │   ├── products/          ← imágenes placeholder de Marobera
│   │   └── articles/          ← imágenes de cabecera de artículos
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx     ← nav bilingüe + selector idioma
│   │   │   ├── Footer.jsx
│   │   │   └── Breadcrumb.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ArticleCard.jsx
│   │   │   └── SectorCard.jsx
│   │   └── seo/
│   │       └── PageSeo.jsx    ← wrapper React Helmet con hreflang
│   ├── pages/
│   │   ├── es/
│   │   │   ├── Home.jsx
│   │   │   ├── Productos.jsx
│   │   │   ├── ProductoDetalle.jsx
│   │   │   ├── Compania.jsx
│   │   │   ├── Novedades.jsx
│   │   │   ├── ArticuloDetalle.jsx
│   │   │   ├── Contacto.jsx
│   │   │   └── Presupuesto.jsx
│   │   └── en/
│   │       ├── Home.jsx
│   │       ├── Products.jsx
│   │       ├── ProductDetail.jsx
│   │       ├── Company.jsx
│   │       ├── News.jsx
│   │       ├── ArticleDetail.jsx
│   │       ├── Contact.jsx
│   │       └── Quote.jsx
│   ├── data/
│   │   ├── products/
│   │   │   └── products.json  ← array con los 26 productos
│   │   └── articles/
│   │       ├── es/            ← [slug-es].json por artículo
│   │       └── en/            ← [slug-en].json por artículo
│   ├── locales/
│   │   ├── es.json            ← todas las traducciones UI en español
│   │   └── en.json            ← todas las traducciones UI en inglés
│   ├── hooks/
│   │   ├── useProducts.js
│   │   ├── useArticles.js
│   │   └── useLang.js
│   └── utils/
│       ├── schema.js          ← generadores de JSON-LD por tipo
│       ├── seo.js             ← helpers para meta tags
│       └── email.js           ← helpers de formato de emails
├── api/
│   ├── contact.js             ← Vercel serverless function
│   ├── quote.js               ← Vercel serverless function
│   └── publish-article.js     ← endpoint para n8n (protegido)
├── CLAUDE.md                  ← este archivo
├── vercel.json                ← rewrites SPA, headers cache, env
├── tailwind.config.js         ← tokens Toromac
├── vite.config.js             ← plugins: sitemap, react
└── .env.local                 ← variables locales (no commitear)
```

---

## 14. Fases de desarrollo (orden de ejecución)

### Fase 1 — Scaffold + configuración base
**Objetivo:** proyecto corriendo en local y desplegado en Vercel vacío.

- [ ] `npm create vite@latest toromac -- --template react`
- [ ] Instalar dependencias: `tailwindcss`, `react-router-dom`, `i18next`, `react-i18next`, `react-helmet-async`, `framer-motion`, `lucide-react`, `react-hook-form`, `zod`, `vite-plugin-sitemap`
- [ ] Configurar `tailwind.config.js` con los tokens de color y tipografía de Toromac
- [ ] Configurar i18next con archivos `es.json` y `en.json` base
- [ ] Configurar React Router con rutas ES + rutas con prefijo `/en/`
- [ ] Configurar `vercel.json` con rewrites para SPA y headers de cache
- [ ] Conectar repo GitHub a Vercel, configurar dominio `toromac.com`
- [ ] Añadir variables de entorno en Vercel Dashboard

### Fase 2 — Sistema de diseño + componentes UI
- [ ] Tokens Tailwind (colores, tipografía, spacing)
- [ ] `Header.jsx` con navegación bilingüe y selector de idioma (flag + ES/EN)
- [ ] `Footer.jsx` bilingüe con columnas: productos, empresa, contacto, RRSS
- [ ] `Button.jsx`, `Badge.jsx`, `ProductCard.jsx`, `ArticleCard.jsx`, `SectorCard.jsx`
- [ ] `PageSeo.jsx` — wrapper que inyecta title, meta, hreflang y JSON-LD
- [ ] `Breadcrumb.jsx` con schema BreadcrumbList

### Fase 3 — Home + Compañía (ES + EN)
- [ ] Home ES completa: hero oscuro, stats (+40 años, clientes), productos destacados (6), sectores (4 cards), logos clientes (carrusel o grid), CTA presupuesto, preview últimas novedades (3 cards)
- [ ] Home EN: misma estructura, contenido traducido
- [ ] Compañía ES: +40 años de experiencia, equipo técnico, sectores con detalle, logos clientes, filosofía de fabricación
- [ ] Compañía EN: versión traducida
- [ ] Schema `Organization` en home

### Fase 4 — Catálogo de productos (ES + EN)
- [ ] Crear `src/data/products/products.json` con los 26 productos completos
- [ ] Página `/productos/` con grid y filtro por categoría (client-side)
- [ ] Página `/en/products/` equivalente
- [ ] Página de producto individual con: specs técnicas, imagen, highlights, breadcrumb, CTA presupuesto, productos relacionados
- [ ] Schema `Product` + `BreadcrumbList` en cada ficha
- [ ] Verificar 26 rutas ES + 26 rutas EN funcionando

### Fase 5 — Formularios + Serverless (Resend)
- [ ] Formulario de contacto ES + EN con validación Zod
- [ ] `api/contact.js` → Resend → `CONTACT_EMAIL`
- [ ] Formulario presupuesto multi-step 3 pasos ES + EN
- [ ] `api/quote.js` → Resend → `CONTACT_EMAIL` con template HTML estructurado
- [ ] Probar envío en local con `.env.local` y en producción
- [ ] Mensaje de confirmación post-envío (sin redirección)

### Fase 6 — Blog / Novedades + SEO técnico + artículos seed
- [ ] Sistema de carga de artículos desde JSON (`useArticles.js`)
- [ ] Página `/novedades/` con listado, filtro por categoría y paginación
- [ ] Página `/en/news/` equivalente
- [ ] Página de artículo individual con: hero image, TOC automático, contenido, FAQ, CTA inline, artículos relacionados
- [ ] Schema `Article` + `FAQPage` + `BreadcrumbList` en cada artículo
- [ ] Endpoint `api/publish-article.js` protegido con Bearer token
- [ ] Configurar `vite-plugin-sitemap` para generar sitemap bilingüe
- [ ] `robots.txt` con bloqueo de `/api/`
- [ ] **Escribir 4 artículos seed** a máxima calidad como referencia para n8n:
  1. "Guía completa sobre tipos de cangilones para elevadores" (ES + EN)
  2. "Elevador de cangilones tipo Z: guía de selección y comparativa" (ES + EN)
  3. "Checklist de mantenimiento para elevadores de cangilones" (ES + EN)
  4. "Cinta transportadora industrial: tipos y aplicaciones" (ES + EN)

### Fase 7 — Flujo n8n + auditoría + lanzamiento
- [ ] Construir workflow n8n desde cero en la instancia de Render (8 nodos según sección 12)
- [ ] Configurar credenciales en n8n: Google Sheets, Serper.dev, OpenAI, Anthropic, HTTP Request con Bearer
- [ ] Probar ejecución manual del workflow end-to-end
- [ ] Verificar que el artículo aparece en producción tras el commit de n8n
- [ ] Auditoría Lighthouse en todas las páginas principales (objetivo: 95+ en todos los apartados)
- [ ] Configurar Google Search Console con el sitemap
- [ ] Configurar Google Analytics 4
- [ ] Go live — verificar DNS, SSL, redirecciones www → sin www

---

## 15. Comandos útiles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Deploy manual a Vercel (normalmente automático via git push)
vercel --prod

# Probar endpoint publish-article en local
curl -X POST http://localhost:5173/api/publish-article \
  -H "Authorization: Bearer tu_publish_secret" \
  -H "Content-Type: application/json" \
  -d '{"articleEs": {...}, "articleEn": {...}}'
```

---

## 16. Checklist antes de go live

- [ ] Lighthouse ≥ 95 en Performance, Accessibility, Best Practices, SEO
- [ ] Todas las rutas ES + EN responden 200
- [ ] Formulario de contacto envía email real a `CONTACT_EMAIL`
- [ ] Formulario de presupuesto envía email estructurado con todos los campos
- [ ] Sitemap.xml accesible en `toromac.com/sitemap.xml` y con todas las URLs
- [ ] `robots.txt` correcto — indexación permitida, `/api/` bloqueada
- [ ] hreflang correcto en todas las páginas (verificar con Google Rich Results Test)
- [ ] Schema JSON-LD válido (verificar con Schema Markup Validator)
- [ ] SSL activo, www redirige a sin www
- [ ] Google Search Console configurado y sitemap enviado
- [ ] Google Analytics 4 recibiendo datos
- [ ] Workflow n8n ejecutado manualmente al menos una vez con éxito
- [ ] Imágenes todas con `width`, `height` y `alt` declarados
- [ ] No hay errores en consola del navegador
- [ ] Web funciona correctamente en mobile (320px mínimo)

---

*Última actualización: mayo 2026 — Plan completo para ejecución con Claude Code*
