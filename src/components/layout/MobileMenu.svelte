<script lang="ts">
	import { LOCALE_STORAGE_KEY } from "@/lib/i18n";

	interface NavLink {
		href: string;
		label: string;
	}

	interface Props {
		isOpen: boolean;
		navLinks: NavLink[];
		blogHref: string;
		blogLabel: string;
		applyLabel: string;
		currentLang: "es" | "en";
		currentPath: string;
		onClose: () => void;
	}

	let {
		isOpen,
		navLinks,
		blogHref,
		blogLabel,
		applyLabel,
		currentLang,
		currentPath,
		onClose,
	}: Props = $props();

	function handleLinkClick() {
		onClose();
	}

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

{#if isOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 bg-bg/95 backdrop-blur-lg flex flex-col items-center justify-center"
		onkeydown={(e) => e.key === "Escape" && onClose()}
	>
		<button
			onclick={onClose}
			class="absolute top-5 right-5 text-text-primary p-2 hover:text-brand transition-colors"
			aria-label="Close menu"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>

		<nav class="flex flex-col items-center gap-6">
			{#each navLinks as link}
				<a
					href={link.href}
					onclick={handleLinkClick}
					class="text-xl font-inter font-semibold text-text-primary hover:text-brand transition-colors"
				>
					{link.label}
				</a>
			{/each}

			<a
				href={blogHref}
				onclick={handleLinkClick}
				class="text-xl font-inter font-semibold text-text-primary hover:text-brand transition-colors"
			>
				{blogLabel}
			</a>

			<hr class="w-20 border-surface my-2" />

			<button
				onclick={switchLanguage}
				class="text-lg font-inter font-medium text-text-secondary hover:text-brand transition-colors"
			>
				{currentLang === "es" ? "English" : "Español"}
			</button>

			<button
				data-tally-open="QK0koA"
				data-tally-hide-title="1"
				data-tally-emoji-text="👋"
				data-tally-emoji-animation="wave"
				data-gtag-label="apply_mobile_menu"
				class="mt-4 px-8 py-3 bg-brand text-white font-inter font-bold rounded-lg hover:shadow-[0_0_30px_var(--color-brand-glow-strong)] transition-all duration-200"
			>
				{applyLabel}
			</button>
		</nav>
	</div>
{/if}
