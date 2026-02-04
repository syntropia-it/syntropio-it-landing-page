# Copilot Instructions for Samana Transformaciones Landing Page

## Project Mission

Landing page corporativa de alto rendimiento para Samana Transformaciones (construcción high-ticket), optimizada para generación de leads calificados mediante SEO orgánico, UX estratégica y performance extrema. Estética nivel Awwwards sin sacrificar velocidad ni accesibilidad.

 **KPIs clave** : 100/100 Lighthouse en todas las métricas | Conversión orgánica sin ads | Analítica completa de comportamiento

## Stack Tecnológico

### Core Framework

* **Astro 5.x** - Static Site Generation (SSG)
  * *Por qué* : HTML estático = velocidad máxima + SEO óptimo + hosting económico
  * *Cuándo usar SSG* : Todo el contenido que no requiera autenticación
  * *Cuándo usar SSR* : Formularios con validación server-side (implementar si es necesario)

### Styling & Animations

* **Tailwind CSS v4** - Utility-first styling
  * Tema custom: `samana-1` (gold `<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#ffd700`), `samana-2/3` (dark shades)
  * *Por qué* : CSS purged automáticamente = bundle mínimo
  * **Regla crítica** : Usar `mix-blend-difference` solo donde aporte valor visual real (navbar overlay)
* **GSAP** (GreenSock Animation Platform)
  * *Casos de uso* : Hero animations, scroll-triggered effects, custom cursor
  * *Límite de performance* : Max 3 animaciones GSAP simultáneas en viewport
  * **Anti-patrón** : Evitar `ScrollTrigger` excesivo 
* **Three.js** - Gráficos 3D
  * *Implementación actual* : Icosaedro background en `Samana3d.astro`
  * *Límite de performance* : 1 canvas 3D por página máximo
  * **Optimización obligatoria** :
  * `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` (evitar sobre-renderizado en pantallas Retina)
  * Geometry y materials deben ser reusables (no crear nuevos en cada frame)

### SEO & Analytics

* **Schema.org** - Structured data (`HomeAndConstructionBusiness` schema en `Layout.astro`)
  * *Próximos schemas necesarios* : `Service`, `FAQPage`, `BreadcrumbList`, `Review`
* **Analytics stack a implementar** :
* Google Analytics 4 (eventos personalizados)
* Microsoft Clarity o Hotjar (heatmaps)
* Custom event tracking (ver sección Analítica)

---

## 📁 Arquitectura de Archivos

```
 src/
├── components/
│   ├── core/              # Componentes globales críticos
│   │   ├── Samana3d.astro # Canvas Three.js (1 por sitio)
│   │   └── CustomCursor.astro # Cursor animado GSAP
|   |   └── Seo.astro
│   ├── layout/            # Estructura de página
│   │   ├── Navbar.astro   # Nav fijo con mix-blend-difference
│   │   └── Footer.astro   # Footer con links SEO
│   ├── sections/          # Secciones por página
│   │   └── home/
│   │       ├── Hero.astro # Hero con GSAP timeline
│   │       ├── Philosophy.astro # Grid de servicios
│   │       ├── GalleryProjects.astro # Proyectos destacados
│   │       ├── Testimonials.astro # Reviews con schema
│   │       └── Contact.astro # Formulario lead gen
│   └── ui/                # Componentes reutilizables
│       ├── Button.astro   # CTAs con tracking
│       ├── Card.astro     # Cards de proyectos/servicios
│       └── Modal.astro    # Modales accesibles
├── layouts/
│   └── Layout.astro       # Layout base con SEO props
├── pages/
│   ├── index.astro        # Homepage
│   ├── servicios/         # URLs semánticas
│   │   └── [slug].astro   # Páginas dinámicas de servicios
│   ├── proyectos/         # Portfolio con URLs dedicadas
│   │   └── [slug].astro   # Casos de estudio (CRÍTICO para SEO)
│   └── blog/              # Content marketing
│       └── [slug].astro   # Artículos optimizados
├── content/               # Content Collections (a implementar)
│   ├── config.ts          # Schema de colecciones
│   ├── services/          # Markdown de servicios
│   ├── projects/          # Markdown de proyectos
│   └── blog/              # Artículos de blog
├── styles/
│   └── global.css         # Tailwind + theme custom
├── scripts
|   ├── analytics.ts       # Event tracking functions
|   └── animations.ts      # GSAP helpers reutilizables
└── utils/
    ├── seo.ts             # Helpers para meta tags
    └── formatters.ts   
```

### Convenciones de Nomenclatura

| Tipo        | Patrón    | Ejemplo                     | Justificación                        |
| ----------- | ---------- | --------------------------- | ------------------------------------- |
| Componentes | PascalCase | `Hero.astro`              | Estándar React/Vue, facilita imports |
| Scripts     | camelCase  | `analytics.ts`            | Estándar TypeScript                  |
| Estilos     | kebab-case | `global.css`              | Estándar CSS                         |
| URLs        | kebab-case | `/proyectos/casa-moderna` | SEO-friendly, legible                 |
| Props       | camelCase  | `showNavbar`              | TypeScript convention                 |

---

## Patrones de Desarrollo

### 1. Componentes Astro con TypeScript

astro

```astro
---
// src/components/ui/Button.astro
interface Props {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: string; // Nombre del evento para analytics
}

const { variant = 'primary', size = 'md', href, onClick } = Astro.props;
---

<a 
  href={href}
  class:list={[
    'inline-block transition-all',
    variant === 'primary' ? 'bg-samana-1 text-black' : 'bg-samana-2 text-white',
    size === 'md' ? 'px-6 py-3' : 'px-4 py-2'
  ]}
  data-track-event={onClick}
>
  <slot />
</a>

<script>
  // Client-side logic inline
  document.querySelectorAll('[data-track-event]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const event = (e.target as HTMLElement).dataset.trackEvent;
      // Llamar función de analytics
      if (window.gtag) {
        window.gtag('event', event, { category: 'CTA' });
      }
    });
  });
</script>
```

 **Por qué este patrón** :

* TypeScript interfaces = props tipadas y autocomplete
* `class:list` de Astro = condicionales limpios
* `data-*` attributes = tracking semántico
* Scripts inline = bundle mínimo (Astro los optimiza automáticamente)

### 2. Animaciones GSAP Reutilizables

typescript

```typescript
// src/utils/animations.ts
import{ gsap }from'gsap';

exportconstfadeInUp=(selector:string, delay =0)=>{
return gsap.from(selector,{
    y:50,
    opacity:0,
    duration:0.8,
    delay,
    ease:'power3.out'
});
};

exportconststaggerCards=(selector:string)=>{
return gsap.from(selector,{
    y:30,
    opacity:0,
    duration:0.6,
    stagger:0.1,
    ease:'power2.out'
});
};
```

 **Uso en componente** :

astro

```astro
<script>
  import { fadeInUp, staggerCards } from '@/utils/animations';
  
  document.addEventListener('DOMContentLoaded', () => {
    fadeInUp('.hero-title', 0.2);
    staggerCards('.service-card');
  });
</script>
```

### 3. SEO Optimizado por Página

astro

```astro
---
// src/layouts/Layout.astro
interface Props {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  schemaType?: object; // Schema.org JSON-LD
}

const { title, description, canonical, image, schemaType } = Astro.props;
const fullTitle = `${title} | Samana Transformaciones`;
const defaultOgImage = '/images/og-default.jpg';
let schemaData;

if (schemaType === 'home') {
  schemaData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "Samana Transformaciones",
    "image": "https://www.samanatransformaciones.com/iso.png",
    "description": description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Defensa 767",
      "addressLocality": "Buenos Aires",
      "addressRegion": "CABA",
      "postalCode": "1065",
      "addressCountry": "AR"
    },
	"openingHoursSpecification": { 
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "19:00"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -34.6158,
      "longitude": -58.3689
    },
    "priceRange": "$$$",
    "telephone": "+5491112345678",
    "url": "https://www.samanatransformaciones.com"
  };
}
---

<head>
  <!-- Critical SEO -->
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical || Astro.url.pathname} />
  
  <!-- Open Graph -->
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage || defaultOgImage} />
  <meta property="og:url" content={Astro.url.href} />
  
  <!-- Schema.org -->
  {schema && (
    <script type="application/ld+json" set:html={JSON.stringify(schema)} />
  )}
</head>
```

**Por qué separar SEO en Layout**:

- DRY principle = cambios globales en un solo lugar
- Props flexibles = personalización por página
- Schema.org via props = fácil gestionar múltiples schemas

---

## Estrategia de Conversión y SEO

### Estructura de Sitio Recomendada

```
/ (Homepage)
├── /servicios/
│   ├── /construccion-residencial/
│   ├── /remodelacion-comercial/
│   └── /arquitectura-sostenible/
├── /proyectos/
│   ├── /casa-moderna-bosque/
│   ├── /edificio-corporativo-cdmx/
│   └── [...más proyectos]
├── /nosotros/
├── /blog/
│   ├── /tendencias-construccion-2025/
│   └── [...artículos]
└── /contacto/
```

 **Justificación de cada sección** :

| Sección        | Propósito SEO                                              | Propósito Conversión                   | Arquitectura                                                       |
| --------------- | ----------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------ |
| `/servicios/` | Keywords transaccionales ("construcción residencial CABA") | Segmentación de leads por servicio      | 1 página por servicio con schema `Service`                      |
| `/proyectos/` | Long-tail keywords + backlinks ("casa moderna Haedo CABA")  | Prueba social visual                     | URLs dedicadas = más páginas indexables + link juice distribuido |
| `/blog/`      | Keywords informacionales (top of funnel)                    | Autoridad + nurturing                    | Artículos optimizados para featured snippets                      |
| `/nosotros/`  | Branded search + confianza                                  | Storytelling + credibilidad              | Schema `Organization`+ team                                      |
| `/contacto/`  | Conversión directa                                         | Formulario optimizado + CTAs secundarios | Schema `ContactPage`                                             |

 **Por qué proyectos necesitan URLs dedicadas** :

1. **SEO técnico** : Cada URL = oportunidad de rankear para keywords específicas del proyecto
2. **Backlinks** : Clientes/medios enlazan proyectos específicos (no homepage)
3. **Internal linking** : Distribuye PageRank entre servicios relacionados
4. **Rich snippets** : Permite implementar schema `CreativeWork` por proyecto
5. **Analytics** : Tracking granular de qué proyectos generan más interés

### Content Collections para Escalabilidad

typescript

```typescript
// src/content/config.ts
import{ defineCollection, z }from'astro:content';

const projectsCollection =defineCollection({
  type:'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['residencial','comercial','sostenible']),
location: z.string(),
    year: z.number(),
    featured: z.boolean().default(false),
    images: z.array(z.string()),
    client: z.string().optional(),
    area: z.string(),// "250 m²"
    budget: z.string().optional(),// "3.5M MXN"
})
});

const servicesCollection =defineCollection({
  type:'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    excerpt: z.string(),
    icon: z.string(),
    price_range: z.string(),// "Desde $2,500 MXN/m²"
    duration: z.string(),// "3-6 meses"
})
});

exportconst collections ={
  projects: projectsCollection,
  services: servicesCollection,
};
```

 **Ventajas de Content Collections** :

* Type-safe content (TypeScript valida frontmatter)
* Fácil filtrado/ordenamiento para listados
* Autocomplete en IDE al crear contenido
* Contenido separado de código = colaboración no-técnica

---

## Analítica Avanzada (Implementación Obligatoria)

### Event Tracking Strategy

typescript

```typescript
// src/utils/analytics.ts

exportenumAnalyticsEvent{
// Navegación
NAV_CLICK='nav_click',
FOOTER_LINK='footer_link',
  
// Conversión
CTA_CLICK='cta_click',
FORM_START='form_start',
FORM_SUBMIT='form_submit',
PHONE_CLICK='phone_click',
EMAIL_CLICK='email_click',
  
// Engagement
SCROLL_DEPTH='scroll_depth',// 25%, 50%, 75%, 100%
VIDEO_PLAY='video_play',
IMAGE_ZOOM='image_zoom',
PROJECT_VIEW='project_view',
  
// Micro-conversiones
DOWNLOAD_BROCHURE='download_brochure',
SHARE_PROJECT='share_project',
}

exportconsttrackEvent=(
  event:AnalyticsEvent,
  params?:Record<string,any>
)=>{
// Google Analytics 4
if(window.gtag){
window.gtag('event', event, params);
}
  
// Microsoft Clarity (custom tags)
if(window.clarity){
window.clarity('set', event,JSON.stringify(params));
}
  
// Console en desarrollo
if(import.meta.env.DEV){
console.log('📊 Analytics Event:', event, params);
}
};

// Scroll depth tracking
exportconstinitScrollTracking=()=>{
const thresholds =[0.25,0.5,0.75,1.0];
const tracked =newSet<number>();
  
constcheckScroll=()=>{
const scrolled =window.scrollY+window.innerHeight;
const total =document.documentElement.scrollHeight;
const percentage = scrolled / total;
  
    thresholds.forEach(threshold =>{
if(percentage >= threshold &&!tracked.has(threshold)){
        tracked.add(threshold);
trackEvent(AnalyticsEvent.SCROLL_DEPTH,{
          depth:`${threshold *100}%`,
          page:window.location.pathname
});
}
});
};
  
window.addEventListener('scroll', checkScroll,{ passive:true});
};
```

### Heatmaps con Microsoft Clarity

astro

```astro
---
// src/layouts/Layout.astro (dentro de <head>)
---
<script is:inline>
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "TU_PROJECT_ID");
</script>
```

 **Métricas críticas a monitorear** :

1. **Conversión** :

* Tasa de envío de formularios por página
* Clics en teléfono/email (intent signals)
* Descargas de brochures/presupuestos

1. **Engagement** :

* Scroll depth promedio
* Tiempo en proyectos destacados
* Rage clicks (indicador de frustración UX)

1. **Micro-conversiones** :

* Proyectos más vistos
* Servicios con más interés
* Páginas de entrada que convierten mejor

---

## Optimización de Performance

### Estrategias Implementadas

1. **Imágenes Optimizadas** (a implementar si no existe):

astro

```astro
---
// src/components/ui/OptimizedImage.astro
import { Image } from 'astro:assets';

interface Props {
  src: ImageMetadata;
  alt: string;
  loading?: 'lazy' | 'eager';
  class?: string;
}

const { src, alt, loading = 'lazy', class: className } = Astro.props;
---

<Image
  src={src}
  alt={alt}
  loading={loading}
  class={className}
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
  format="webp"
/>
```

 **Por qué** :

* Astro genera automáticamente múltiples tamaños
* WebP = 30% menos peso que JPEG
* `loading="lazy"` = imágenes fuera de viewport no bloquean render

2. **Critical CSS Inline** (configurado en build):

javascript

```javascript
// astro.config.mjs
exportdefaultdefineConfig({
build:{
inlineStylesheets:'auto'// Inline CSS crítico automáticamente
}
});
```

3. **Prefetch de Links Críticos** :

astro

```astro
<a href="/servicios/" rel="prefetch">Servicios</a>
```

### Checklist Pre-Deploy

* [ ] Lighthouse Score 100 en todas las métricas
* [ ] Todas las imágenes en formato WebP/AVIF
* [ ] Fuentes con `font-display: swap`
* [ ] No hay JavaScript bloqueante en `<head>`
* [ ] Critical CSS inlineado
* [ ] Meta tags completos en todas las páginas
* [ ] Schema.org implementado
* [ ] Analytics con eventos configurados
* [ ] Sitemap.xml generado (`@astrojs/sitemap`)
* [ ] Robots.txt configurado

---

## Workflow de Desarrollo

### Scripts Disponibles

json

```json
{
"scripts":{
"dev":"astro dev",// Servidor local en puerto 4321
"build":"astro build",// Build de producción en /dist
"preview":"astro preview",// Preview del build
"astro":"astro"// CLI de Astro
}
}
```

### Próximos Pasos Críticos

**Prioridad Alta** (Impacto directo en conversión/SEO):

1. Completar componentes vacíos:
   * `GalleryProjects.astro` → Grid con scroll horizontal para ver proyectos destacados
   * `Contact.astro` → Formulario con validación y proceso multistep
   * `Services.astro` → Cards con CTAs específicos por servicio
2. Implementar Content Collections:
   * Migrar proyectos a `/src/content/projects/`
   * Crear páginas dinámicas en `/proyectos/[slug].astro`
   * Implementar schema `CreativeWork` por proyecto
3. Analytics Setup:
   * Integrar GA4 con eventos personalizados
   * Configurar Microsoft Clarity
   * Crear dashboard en Looker Studio

**Prioridad Media** (Escalabilidad):
4. Blog para content marketing:

* Content collection para artículos
* Schema `BlogPosting`
* Sitemap dinámico

5. Optimizaciones avanzadas:
   * Service Worker para offline support
   * PWA manifest
   * Preloading estratégico de rutas

### Evaluación de Deuda Técnica Actual

| Archivo                   | Estado                       | Acción Requerida                                        |
| ------------------------- | ---------------------------- | -------------------------------------------------------- |
| `src/utils/*.ts`        | Vacíos                      | Implementar helpers de SEO y analytics                   |
| `src/content/config.ts` | Sin usar                     | Definir schemas de collections                           |
| GSAP ScrollTrigger        | Registrado pero no usado     | Evaluar si remover o implementar scroll animations       |
| Three.js canvas           | Funcional pero no optimizado | Implementar `renderer.setPixelRatio(Math.min(2, dpr))` |

---

## Recursos y Referencias

### Documentación Esencial

* [Astro Docs](https://docs.astro.build)
* [Tailwind CSS v4](https://tailwindcss.com/docs)
* [GSAP Docs](https://greensock.com/docs/)
* [Schema.org HomeAndConstructionBusiness](https://schema.org/HomeAndConstructionBusiness)

### Herramientas de Testing

* **Lighthouse** : Performance, SEO, A11y, Best Practices
* **PageSpeed Insights** : Core Web Vitals reales
* **Screaming Frog** : Auditoría técnica SEO
* **Ahrefs/Semrush** : Keyword research y competencia

### Benchmarks de Performance para High-Ticket

| Métrica | Objetivo | Actual  | Brecha |
| -------- | -------- | ------- | ------ |
| LCP      | < 2.5s   | A medir | -      |
| FID      | < 100ms  | A medir | -      |
| CLS      | < 0.1    | A medir | -      |
| TTI      | < 3.8s   | A medir | -      |

---

## Glosario para Copilot

 **SSG (Static Site Generation)** : Pre-renderizado de páginas en build time. Ventaja: HTML estático servido instantáneamente. Desventaja: requiere rebuild para actualizar contenido.

 **Schema.org** : Vocabulario de structured data que permite a Google mostrar rich snippets (estrellas de reviews, breadcrumbs, FAQs en resultados).

 **Long-tail keywords** : Búsquedas específicas con menos volumen pero mayor intención de compra (ej: "construcción casa moderna bosque Querétaro").

 **PageRank** : Algoritmo de Google que distribuye autoridad entre páginas enlazadas. Internal linking estratégico mejora SEO de páginas profundas.

 **Core Web Vitals** : Métricas de experiencia de usuario que Google usa para ranking: LCP (velocidad de carga visual), FID (interactividad), CLS (estabilidad visual).
