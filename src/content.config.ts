import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		excerpt: z.string().max(200),
		tags: z.array(z.string()),
		author: z.string().optional(),
		image: z.string().optional(),
	}),
});

const tags = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/tags" }),
	schema: z.object({
		name_es: z.string(),
		name_en: z.string(),
		description: z.string().optional(),
		order: z.number().default(0),
	}),
});

export const collections = { blog, tags };
