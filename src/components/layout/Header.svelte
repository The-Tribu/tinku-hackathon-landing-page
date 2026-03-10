<script lang="ts">
	import LanguageToggle from "./LanguageToggle.svelte";

	interface Props {
		applyLabel: string;
		currentLang: "es" | "en";
		currentPath: string;
	}

	let { applyLabel, currentLang, currentPath }: Props = $props();
</script>

<header
	class="fixed top-0 left-0 right-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-brand/8"
>
	<div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
		<!-- Logo -->
		<a href={currentLang === "en" ? "/en/" : "/"} class="shrink-0">
			<img
				src="/images/brand/tinku-logo-h16.png"
				alt="Tinku"
				class="h-[34px]"
				width="68"
				height="34"
			/>
		</a>

		<!-- Right side: Language toggle y botón de inscribirse -->
		<div class="flex items-center gap-3">
			<!-- Language toggle - solo visible en desktop -->
			<div class="hidden sm:block">
				<LanguageToggle {currentLang} {currentPath} />
			</div>

			<button
				data-tally-open="kdA05d"
				data-tally-hide-title="1"
				data-tally-emoji-text="👋"
				data-tally-emoji-animation="wave"
				class="px-4 py-2 bg-brand text-white text-sm font-inter font-bold rounded-lg hover:shadow-[0_0_20px_var(--color-brand-glow-strong)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
			>
				{applyLabel}
			</button>
		</div>
	</div>
</header>
