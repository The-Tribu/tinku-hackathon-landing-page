<script lang="ts">
	interface FAQItemData {
		id: string;
		question: string;
		answer: string;
	}

	interface Props {
		label: string;
		title: string;
		items: FAQItemData[];
	}

	let { label, title, items }: Props = $props();

	let openItems: Set<string> = $state(new Set());

	function toggleItem(id: string) {
		const next = new Set(openItems);
		if (next.has(id)) {
			next.delete(id);
		} else {
			next.add(id);
		}
		openItems = next;
	}
</script>

<section id="faq" class="py-20 px-4">
	<div class="max-w-3xl mx-auto">
		<div class="flex items-center gap-3 mb-4">
			<span class="inline-block w-2 h-2 rotate-45 bg-brand shrink-0" aria-hidden="true"></span>
			<span class="text-xs font-bold uppercase tracking-[0.2em] text-text-muted font-satoshi">
				{label}
			</span>
		</div>
		<h2 class="text-3xl sm:text-4xl font-inter font-black text-text-primary mb-12">
			{title}
		</h2>

		<div class="space-y-3">
			{#each items as item}
				{@const isOpen = openItems.has(item.id)}
				<div class="rounded-xl bg-surface/50 border border-surface overflow-hidden">
					<button
						onclick={() => toggleItem(item.id)}
						class="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer"
						aria-expanded={isOpen}
						aria-controls="faq-{item.id}"
					>
						<span class="font-inter font-semibold text-[15px] text-text-primary">
							{item.question}
						</span>
						<span
							class="shrink-0 w-3 h-3 border-r-2 border-b-2 border-brand transition-transform duration-300"
							class:rotate-45={!isOpen}
							class:-rotate-[135deg]={isOpen}
							aria-hidden="true"
						></span>
					</button>
					<div
						id="faq-{item.id}"
						class="grid transition-all duration-300 ease-in-out"
						class:grid-rows-[1fr]={isOpen}
						class:grid-rows-[0fr]={!isOpen}
					>
						<div class="overflow-hidden">
							<p class="px-5 pb-5 font-satoshi text-[15px] text-text-secondary leading-relaxed">
								{item.answer}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
