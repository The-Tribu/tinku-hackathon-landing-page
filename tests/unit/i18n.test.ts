import { describe, it, expect } from "vitest";
import { getLangFromUrl, useTranslations, getLocalePath, getAlternateLang } from "@/lib/i18n";

describe("getLangFromUrl", () => {
	it("returns 'es' for root URL", () => {
		expect(getLangFromUrl(new URL("https://example.com/"))).toBe("es");
	});

	it("returns 'en' for /en/ prefix", () => {
		expect(getLangFromUrl(new URL("https://example.com/en/"))).toBe("en");
	});

	it("returns 'en' for /en/blog/ path", () => {
		expect(getLangFromUrl(new URL("https://example.com/en/blog/"))).toBe("en");
	});

	it("returns 'es' for /blog/ path without en prefix", () => {
		expect(getLangFromUrl(new URL("https://example.com/blog/"))).toBe("es");
	});
});

describe("useTranslations", () => {
	it("returns Spanish translation for es locale", () => {
		const t = useTranslations("es");
		expect(t("nav.apply")).toBe("Aplicar");
	});

	it("returns English translation for en locale", () => {
		const t = useTranslations("en");
		expect(t("nav.apply")).toBe("Apply");
	});

	it("keeps brand terms in Spanish for en locale", () => {
		const t = useTranslations("en");
		expect(t("hero.tagline")).toBe("Ritual CreAItivo");
	});
});

describe("getLocalePath", () => {
	it("returns root for es locale with root path", () => {
		expect(getLocalePath("/", "es")).toBe("/");
	});

	it("returns /en/ for en locale with root path", () => {
		expect(getLocalePath("/", "en")).toBe("/en/");
	});

	it("strips /en/ prefix for es locale", () => {
		expect(getLocalePath("/en/blog/", "es")).toBe("/blog/");
	});

	it("adds /en/ prefix for en locale", () => {
		expect(getLocalePath("/blog/", "en")).toBe("/en/blog/");
	});
});

describe("getAlternateLang", () => {
	it("returns en for es", () => {
		expect(getAlternateLang("es")).toBe("en");
	});

	it("returns es for en", () => {
		expect(getAlternateLang("en")).toBe("es");
	});
});
