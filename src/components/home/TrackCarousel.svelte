<script lang="ts">
	import useEmblaCarousel from "embla-carousel-svelte";
	import Autoplay from "embla-carousel-autoplay";
	import type { EmblaCarouselType } from "embla-carousel";

	interface TrackItem {
		emoji: string;
		name: string;
		description: string;
	}

	interface Props {
		tracks: TrackItem[];
	}

	let { tracks }: Props = $props();

	let emblaApi: EmblaCarouselType | undefined = $state(undefined);
	let selectedIndex: number = $state(0);
	let snapCount: number = $state(0);

	const prefersReducedMotion =
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const options = { loop: true, align: "start" as const };
	const plugins = prefersReducedMotion ? [] : [Autoplay({ delay: 4000, stopOnInteraction: false })];

	function onInit(event: CustomEvent<EmblaCarouselType>) {
		emblaApi = event.detail;
		snapCount = emblaApi.scrollSnapList().length;
		selectedIndex = emblaApi.selectedScrollSnap();

		emblaApi.on("select", () => {
			selectedIndex = emblaApi!.selectedScrollSnap();
		});

		emblaApi.on("resize", () => {
			snapCount = emblaApi!.scrollSnapList().length;
		});

		if (!prefersReducedMotion) {
			emblaApi.plugins().autoplay?.play();
		}
	}

	function scrollTo(index: number) {
		emblaApi?.scrollTo(index);
	}

	function scrollPrev() {
		emblaApi?.scrollPrev();
	}

	function scrollNext() {
		emblaApi?.scrollNext();
	}
</script>

<div class="track-carousel relative">
	<!-- Fade overlays -->
	<div
		class="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-24"
		style="background: linear-gradient(to right, var(--color-bg) 0%, var(--color-bg) 20%, transparent 100%);"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-24"
		style="background: linear-gradient(to left, var(--color-bg) 0%, var(--color-bg) 20%, transparent 100%);"
		aria-hidden="true"
	></div>

	<!-- Embla viewport -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="embla__viewport overflow-hidden" use:useEmblaCarousel={{ options, plugins }} onemblaInit={onInit}>
		<div class="embla__container flex touch-pan-y touch-pinch-zoom">
			{#each tracks as track, i}
				<div class="embla__slide min-w-0 pl-4">
					<div
						class="h-full p-6 rounded-2xl bg-surface/60 border border-transparent hover:border-brand/40 hover:shadow-[0_0_30px_var(--color-brand-glow)] transition-all duration-200"
					>
						<span class="text-3xl mb-3 block">{track.emoji}</span>
						<h3 class="text-lg font-inter font-bold text-text-primary mb-2">
							{track.name}
						</h3>
						<p class="text-sm font-satoshi text-text-secondary">
							{track.description}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Navigation: arrows + dots -->
	<div class="flex items-center justify-center gap-4 mt-6">
		<button
			onclick={scrollPrev}
			class="flex items-center justify-center w-9 h-9 rounded-full border border-surface hover:border-brand/40 hover:bg-surface/60 text-text-muted hover:text-brand transition-all duration-200 cursor-pointer"
			aria-label="Previous slide"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<div class="flex items-center gap-2.5">
			{#each Array(snapCount) as _, i}
				<button
					onclick={() => scrollTo(i)}
					class="h-2.5 rounded-full transition-all duration-300 cursor-pointer {selectedIndex === i
						? 'w-7 bg-brand'
						: 'w-2.5 bg-text-muted/50 hover:bg-text-muted'}"
					aria-label="Go to slide {i + 1}"
				></button>
			{/each}
		</div>

		<button
			onclick={scrollNext}
			class="flex items-center justify-center w-9 h-9 rounded-full border border-surface hover:border-brand/40 hover:bg-surface/60 text-text-muted hover:text-brand transition-all duration-200 cursor-pointer"
			aria-label="Next slide"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>
</div>

<style>
	.embla__slide {
		flex: 0 0 82%;
	}

	@media (min-width: 768px) {
		.embla__slide {
			flex: 0 0 46%;
		}
	}

	@media (min-width: 1024px) {
		.embla__slide {
			flex: 0 0 34%;
		}
	}
</style>
