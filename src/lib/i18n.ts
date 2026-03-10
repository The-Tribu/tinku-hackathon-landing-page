import { es } from "./translations/es";
import { en } from "./translations/en";

export type Locale = "es" | "en";

export type TranslationKey = keyof typeof es;

const translations = { es, en } as const;

export function getLangFromUrl(url: URL): Locale {
	const segments = url.pathname.split("/");
	if (segments[1] === "en") return "en";
	return "es";
}

export function useTranslations(lang: Locale) {
	return function t(key: TranslationKey): string {
		return translations[lang][key] ?? translations.es[key] ?? key;
	};
}

export function getLocalePath(path: string, lang: Locale): string {
	const cleanPath = path.replace(/^\/en\/?/, "/").replace(/^\/$/, "");
	if (lang === "en") {
		return `/en${cleanPath || "/"}`;
	}
	return cleanPath || "/";
}

export function getAlternateLang(lang: Locale): Locale {
	return lang === "es" ? "en" : "es";
}

export const LOCALE_STORAGE_KEY = "tinku-lang";

export const languageDetectionScript = `
(function() {
  var key = "${LOCALE_STORAGE_KEY}";
  var stored = localStorage.getItem(key);
  var path = window.location.pathname;
  var isEn = path.startsWith("/en");

  if (stored) {
    if (stored === "en" && !isEn) {
      window.location.replace("/en" + path);
      return;
    }
    if (stored === "es" && isEn) {
      window.location.replace(path.replace(/^\\/en\\/?/, "/") || "/");
      return;
    }
    return;
  }

  var browserLang = (navigator.language || "").toLowerCase();
  var preferred = browserLang.startsWith("en") ? "en" : "es";
  localStorage.setItem(key, preferred);

  if (preferred === "en" && !isEn) {
    window.location.replace("/en" + path);
  }
})();
`;
