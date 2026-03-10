<script lang="ts">
	import { getCountdownValues, formatCountdownUnit, type CountdownValues } from "@/lib/countdown";

	interface Props {
		labels: {
			days: string;
			hours: string;
			minutes: string;
			seconds: string;
			eventEndsIn: string;
			completed: string;
		};
	}

	let { labels }: Props = $props();

	let countdown: CountdownValues = $state(getCountdownValues(new Date()));

	$effect(() => {
		const interval = setInterval(() => {
			countdown = getCountdownValues(new Date());
		}, 1000);
		return () => clearInterval(interval);
	});

	const units = $derived([
		{ value: countdown.days, label: labels.days },
		{ value: countdown.hours, label: labels.hours },
		{ value: countdown.minutes, label: labels.minutes },
		{ value: countdown.seconds, label: labels.seconds },
	]);
</script>

<div class="text-center" role="timer" aria-live="polite" aria-label="Countdown timer">
	{#if countdown.state === "COMPLETED"}
		<p class="text-xl font-inter font-bold text-brand">{labels.completed}</p>
	{:else}
		{#if countdown.state === "DURING_EVENT"}
			<p class="text-sm font-satoshi text-text-secondary mb-3">{labels.eventEndsIn}</p>
		{/if}
		<div class="flex items-center justify-center gap-3 sm:gap-4">
			{#each units as unit, i}
				{#if i > 0}
					<span class="text-2xl font-inter font-bold text-brand/60" aria-hidden="true">:</span>
				{/if}
				<div class="flex flex-col items-center gap-1">
					<div
						class="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-lg bg-surface/80 backdrop-blur-sm border border-brand/10 hover:border-brand/30 hover:shadow-[0_0_20px_var(--color-brand-glow)] transition-all duration-200"
					>
						<span class="text-2xl sm:text-3xl font-mono font-bold text-brand tabular-nums">
							{formatCountdownUnit(unit.value)}
						</span>
					</div>
					<span class="text-xs font-satoshi text-text-muted uppercase tracking-wider">
						{unit.label}
					</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
