<script lang="ts">
	import LanguageToggle from "./LanguageToggle.svelte";
	import MobileMenu from "./MobileMenu.svelte";

	interface NavLink {
		href: string;
		label: string;
	}

	interface Props {
		navLinks: NavLink[];
		blogHref: string;
		blogLabel: string;
		applyLabel: string;
		currentLang: "es" | "en";
		currentPath: string;
	}

	let { navLinks, blogHref, blogLabel, applyLabel, currentLang, currentPath }: Props = $props();

	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}
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

		<!-- Desktop nav -->
		<nav class="hidden md:flex items-center gap-6" aria-label="Main navigation">
			{#each navLinks as link}
				<a
					href={link.href}
					class="text-sm font-satoshi font-medium text-text-secondary hover:text-text-primary transition-colors duration-200"
				>
					{link.label}
				</a>
			{/each}
			<a
				href={blogHref}
				class="text-sm font-satoshi font-medium text-text-secondary hover:text-text-primary transition-colors duration-200"
			>
				{blogLabel}
			</a>
		</nav>

		<!-- Right side -->
		<div class="flex items-center gap-3">
			<div class="hidden md:block">
				<LanguageToggle {currentLang} {currentPath} />
			</div>

			<button
				data-tally-open="kdA05d"
				data-tally-hide-title="1"
				data-tally-emoji-text="👋"
				data-tally-emoji-animation="wave"
				class="hidden sm:inline-flex px-4 py-2 bg-brand text-white text-sm font-inter font-bold rounded-lg hover:shadow-[0_0_20px_var(--color-brand-glow-strong)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
			>
				{applyLabel}
			</button>

			<!-- Mobile hamburger -->
			<button
				onclick={toggleMenu}
				class="md:hidden p-2 text-text-primary hover:text-brand transition-colors"
				aria-label="Open menu"
				aria-expanded={isMenuOpen}
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
		</div>
	</div>
</header>

<MobileMenu
	{isMenuOpen}
	{navLinks}
	{blogHref}
	{blogLabel}
	{applyLabel}
	{currentLang}
	{currentPath}
	onClose={closeMenu}
/>
