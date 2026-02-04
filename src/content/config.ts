import { defineCollection, z } from 'astro:content';

/**
 * CONTENT COLLECTIONS
 *
 * ¿Qué son?
 * Sistema de CMS integrado en Astro que valida y estructura contenido Markdown/MDX.
 *
 * ¿Por qué usarlas?
 * - Type-safety: TypeScript valida que cada proyecto tenga todos los campos
 * - Performance: Consultas optimizadas en build time
 * - Escalabilidad: Agregar 100+ proyectos sin tocar código
 *
 * ¿Cómo funcionan?
 * 1. Defines el schema aquí
 * 2. Creas archivos .md en src/content/proyectos/
 * 3. Astro los valida y genera tipos automáticamente
 */

// COLECCIÓN: Proyectos
const projects = defineCollection({
    type: 'content', // Contenido Markdown
    schema: ({ image }) =>
        z.object({
            // Campos obligatorios
            title: z.string().max(60, 'El título debe tener máximo 60 caracteres para SEO'),
            description: z
                .string()
                .max(160, 'La descripción debe tener máximo 160 caracteres para meta tags'),
            category: z.enum([
                'Reforma Total',
                'Residencial',
                'Corporativo',
                'Rehabilitación',
                'Exterior',
            ]),
            year: z.number().min(2020).max(new Date().getFullYear()),
            image: image(),
            featured: z.boolean().default(false), // Destacar en home
            client: z.string().optional(), // Nombre del cliente
            duration: z.string().optional(), // "3 meses"
            budget: z.string().optional(), // "USD 50,000 - 100,000"
            location: z.string().optional(), // "Palermo, CABA"
            area: z.number().optional(), // Metros cuadrados

            // SEO adicional
            ogImage: z.string().optional(), // Open Graph image personalizada
            tags: z.array(z.string()).default([]), // Keywords adicionales
        }),
});

// COLECCIÓN: Blog
const blog = defineCollection({
    type: 'content',
    schema: ({ image }) =>
        z.object({
            title: z.string().max(60),
            description: z.string().max(160),
            publishDate: z.coerce.date(), // Convierte string a Date
            author: z.string().default('Equipo Samana'),

            // Imagen
            image: image(),

            // Categorización
            tags: z.array(z.string()), // ["reformas", "diseño", "arquitectura"]
            category: z.enum(['Guías', 'Tendencias', 'Casos de Estudio', 'Tips']),

            // SEO
            featured: z.boolean().default(false),
            draft: z.boolean().default(false), // No publicar si es true
        }),
});

// COLECCIÓN: Servicios
const services = defineCollection({
    type: 'content',
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string(), // Nombre del ícono de Lucide
            order: z.number(), // Orden de aparición
            image: image(),

            // Features del servicio
            features: z.array(z.string()),

            // Pricing (opcional)
            priceRange: z.string().optional(), // "Desde USD 5,000"
        }),
});

export const collections = {
    projects,
    blog,
    services,
};
