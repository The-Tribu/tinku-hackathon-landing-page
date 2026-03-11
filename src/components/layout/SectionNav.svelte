<script lang="ts">
	interface NavItem {
		href: string;
		label: string;
	}

	interface Props {
		items: NavItem[];
	}

	let { items }: Props = $props();

	let activeIndex = $state(-1);
	let visible = $state(false);

	$effect(() => {
		const sectionIds = items.map((item) => item.href.replace("#", ""));
		const sections = sectionIds
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => el !== null);

		function updateActive() {
			const scrollY = window.scrollY + window.innerHeight * 0.35;

			let current = -1;
			for (let i = sections.length - 1; i >= 0; i--) {
				if (sections[i].offsetTop <= scrollY) {
					current = i;
					break;
				}
			}
			activeIndex = current;
			visible = current >= 0;
		}

		updateActive();
		window.addEventListener("scroll", updateActive, { passive: true });
		window.addEventListener("resize", updateActive, { passive: true });

		return () => {
			window.removeEventListener("scroll", updateActive);
			window.removeEventListener("resize", updateActive);
		};
	});

	function handleClick(href: string) {
		const id = href.replace("#", "");
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: "smooth" });
		}
	}

	function handleKeydown(event: KeyboardEvent, href: string) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleClick(href);
		}
	}

	const reducedMotion =
		typeof window !== "undefined"
			? window.matchMedia("(prefers-reduced-motion: reduce)").matches
			: false;
</script>

<nav
	class="fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-start gap-[10px] lg:flex"
	class:nav-visible={visible}
	class:nav-hidden={!visible}
	aria-label="Section navigation"
	role="navigation"
>
	{#each items as item, i}
		<div class="group relative flex items-center">
			<button
				type="button"
				onclick={() => handleClick(item.href)}
				onkeydown={(e) => handleKeydown(e, item.href)}
				class="nav-dot {i === activeIndex ? 'nav-dot-active' : 'nav-dot-inactive'}"
				aria-label={item.label}
				aria-current={i === activeIndex ? "true" : undefined}
			></button>

			{#if i === activeIndex}
				<div class="nav-label" class:nav-label-animated={!reducedMotion}>
					<span class="nav-label-counter">{i + 1} / {items.length}</span>
					<span class="nav-label-title">{item.label}</span>
				</div>
			{/if}
		</div>
	{/each}
</nav>

<style>
	.nav-visible {
		opacity: 1;
		pointer-events: auto;
		transition: opacity 0.4s ease-out;
	}

	.nav-hidden {
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.4s ease-out;
	}

	.nav-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: none;
		padding: 0;
		cursor: pointer;
		transition:
			background-color 0.35s cubic-bezier(0.22, 1, 0.36, 1),
			transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.35s ease;
	}

	.nav-dot-inactive {
		background-color: var(--color-text-muted);
		opacity: 0.35;
	}

	.nav-dot-inactive:hover {
		opacity: 0.7;
		transform: scale(1.2);
	}

	.nav-dot-active {
		background-color: var(--color-brand);
		opacity: 1;
		transform: scale(1.35);
		box-shadow:
			0 0 12px var(--color-brand-glow-strong),
			0 0 4px var(--color-brand);
	}

	.nav-label {
		position: absolute;
		left: 22px;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: 1px;
		white-space: nowrap;
		pointer-events: none;
	}

	.nav-label-animated {
		animation: label-slide-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.nav-label-counter {
		font-size: 0.6rem;
		font-weight: 600;
		color: var(--color-brand);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-family: var(--font-inter);
		line-height: 1;
	}

	.nav-label-title {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--color-text-primary);
		font-family: var(--font-inter);
		line-height: 1.2;
	}

	@keyframes label-slide-in {
		from {
			opacity: 0;
			transform: translateY(-50%) translateX(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(-50%) translateX(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.nav-label-animated {
			animation: none;
		}

		.nav-dot {
			transition: none;
		}

		.nav-visible,
		.nav-hidden {
			transition: none;
		}
	}
</style>
