<script lang="ts">
	interface Post {
		slug: string;
		title: string;
		date: string;
		excerpt: string;
		tags: string[];
		href: string;
	}

	interface TagDef {
		id: string;
		name: string;
	}

	interface Props {
		posts: Post[];
		tags: TagDef[];
		searchPlaceholder: string;
		noResultsMessage: string;
		noPostsMessage: string;
		backToHomeLabel: string;
		backToHomeHref: string;
	}

	let { posts, tags, searchPlaceholder, noResultsMessage, noPostsMessage, backToHomeLabel, backToHomeHref }: Props = $props();

	let searchQuery = $state("");
	let activeTag = $state<string | null>(null);

	const filteredPosts = $derived(() => {
		let result = posts;

		if (activeTag) {
			result = result.filter((post) => post.tags.includes(activeTag!));
		}

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(post) =>
					post.title.toLowerCase().includes(query) ||
					post.excerpt.toLowerCase().includes(query),
			);
		}

		return result;
	});

	function toggleTag(tagId: string) {
		activeTag = activeTag === tagId ? null : tagId;
	}
</script>

<div class="space-y-8">
	<!-- Search and filters -->
	<div class="space-y-4">
		<input
			type="search"
			bind:value={searchQuery}
			placeholder={searchPlaceholder}
			class="w-full px-4 py-3 rounded-xl bg-surface/50 border border-surface text-text-primary placeholder-text-muted font-satoshi focus:outline-none focus:border-brand/40 transition-colors"
		/>

		{#if tags.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each tags as tag}
				<button
					onclick={() => toggleTag(tag.id)}
					class="px-3 py-1.5 rounded-lg text-sm font-inter font-medium transition-all duration-200 cursor-pointer {activeTag === tag.id ? 'bg-brand text-white' : 'bg-surface/50 text-text-secondary hover:text-text-primary'}"
				>
						{tag.name}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Posts grid -->
	{#if posts.length === 0}
		<div class="text-center py-16 space-y-4">
			<p class="text-text-secondary font-satoshi text-lg">{noPostsMessage}</p>
			<a href={backToHomeHref} class="text-brand font-inter font-medium hover:underline">
				{backToHomeLabel}
			</a>
		</div>
	{:else if filteredPosts().length === 0}
		<div class="text-center py-16">
			<p class="text-text-secondary font-satoshi text-lg">{noResultsMessage}</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filteredPosts() as post}
				<a
					href={post.href}
					class="group block p-6 rounded-2xl bg-surface/40 border border-surface hover:border-brand/30 hover:shadow-[0_0_20px_var(--color-brand-glow)] transition-all duration-200"
				>
					<time class="text-xs font-mono text-text-muted">{post.date}</time>
					<h3 class="text-lg font-inter font-bold text-text-primary mt-2 mb-3 group-hover:text-brand transition-colors">
						{post.title}
					</h3>
					<p class="text-sm font-satoshi text-text-secondary line-clamp-3 mb-4">
						{post.excerpt}
					</p>
					<div class="flex flex-wrap gap-2">
						{#each post.tags as tag}
							<span class="px-2.5 py-1 rounded-md bg-brand/10 text-brand text-xs font-inter font-medium">
								{tag}
							</span>
						{/each}
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
