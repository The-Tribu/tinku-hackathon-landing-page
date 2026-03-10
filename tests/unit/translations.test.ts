import { describe, it, expect } from "vitest";
import { es } from "@/lib/translations/es";
import { en } from "@/lib/translations/en";

describe("translation parity", () => {
	const esKeys = Object.keys(es).sort();
	const enKeys = Object.keys(en).sort();

	it("both locales have the same number of keys", () => {
		expect(esKeys.length).toBe(enKeys.length);
	});

	it("every key in es.ts exists in en.ts", () => {
		for (const key of esKeys) {
			expect(enKeys).toContain(key);
		}
	});

	it("every key in en.ts exists in es.ts", () => {
		for (const key of enKeys) {
			expect(esKeys).toContain(key);
		}
	});

	it("no translation value is empty", () => {
		for (const [key, value] of Object.entries(es)) {
			expect(value, `es.${key} is empty`).not.toBe("");
		}
		for (const [key, value] of Object.entries(en)) {
			expect(value, `en.${key} is empty`).not.toBe("");
		}
	});

	it("brand terms remain in Spanish in English translations", () => {
		expect(en["hero.tagline"]).toBe("Ritual CreAItivo");
		expect(en["footerCta.title"]).toBe("Tu vIAje comienza aquí");
	});
});
