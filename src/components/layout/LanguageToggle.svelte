<script lang="ts">
	import { LOCALE_STORAGE_KEY } from "@/lib/i18n";

	interface Props {
		currentLang: "es" | "en";
		currentPath: string;
	}

	let { currentLang, currentPath }: Props = $props();

	function getAlternatePath(): string {
		if (currentLang === "es") {
			return `/en${currentPath === "/" ? "/" : currentPath}`;
		}
		return currentPath.replace(/^\/en\/?/, "/") || "/";
	}

	function switchLanguage() {
		const newLang = currentLang === "es" ? "en" : "es";
		localStorage.setItem(LOCALE_STORAGE_KEY, newLang);
		window.location.href = getAlternatePath();
	}
</script>

<button
	onclick={switchLanguage}
	class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-inter font-medium text-text-secondary hover:text-text-primary hover:bg-surface/50 transition-colors duration-200"
	aria-label="Switch language to {currentLang === 'es' ? 'English' : 'Español'}"
>
	<span class={currentLang === "es" ? "text-brand font-bold" : "opacity-60"}>ES</span>
	<span class="text-text-muted">/</span>
	<span class={currentLang === "en" ? "text-brand font-bold" : "opacity-60"}>EN</span>
</button>
