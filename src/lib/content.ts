import { getCollection } from "astro:content";
import type { Locale } from "./i18n";

export async function getPostsByLocale(locale: Locale) {
	const allPosts = await getCollection("blog");
	return allPosts
		.filter((post) => post.id.startsWith(`${locale}/`))
		.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getPostBySlug(locale: Locale, slug: string) {
	const allPosts = await getCollection("blog");
	return allPosts.find((post) => post.id === `${locale}/${slug}`);
}

export async function getAllTags() {
	return await getCollection("tags");
}

export function getLocaleFromPostId(id: string): Locale {
	return id.startsWith("en/") ? "en" : "es";
}

export function getSlugFromPostId(id: string): string {
	return id.replace(/^(en|es)\//, "");
}
