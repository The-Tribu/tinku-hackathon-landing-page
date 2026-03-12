<script lang="ts">
	interface Props {
		promptText: string;
		completedTitle: string;
		completedSubtitle: string;
		ctaText: string;
		replayLabel: string;
		skipLabel: string;
		closeLabel: string;
		progressLabel: string;
		offeringNames: string[];
	}

	let {
		promptText,
		completedTitle,
		completedSubtitle,
		ctaText,
		replayLabel,
		skipLabel,
		closeLabel,
		progressLabel,
		offeringNames,
	}: Props = $props();

	const TOTAL = 7;
	const HIT_R_DESKTOP = 34;
	const HIT_R_MOBILE = 50;
	const FIRE_COUNT = 45;

	let isOpen = $state(false);
	let gameState: "playing" | "completed" = $state("playing");
	let collected = $state(0);
	let canvas: HTMLCanvasElement | undefined = $state();
	let modalEl: HTMLDivElement | undefined = $state();
	let closeBtn: HTMLButtonElement | undefined = $state();
	let animId = 0;
	let time = 0;
	let offerings: Offering[] = [];
	let fireParticles: FireParticle[] = [];
	let bursts: Burst[] = [];
	let nameFloats: NameFloat[] = [];
	let bgStars: BgStar[] = [];
	let firePitGlow = 0;
	let isMobile = false;

	const prefersReducedMotion =
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	interface Offering {
		x: number;
		y: number;
		vx: number;
		vy: number;
		freqX: number;
		freqY: number;
		phaseX: number;
		phaseY: number;
		ampX: number;
		ampY: number;
		pulsePhase: number;
		type: number;
		collected: boolean;
	}

	interface FireParticle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		life: number;
		maxLife: number;
		size: number;
	}

	interface Burst {
		x: number;
		y: number;
		radius: number;
		opacity: number;
		r: number;
		g: number;
		b: number;
	}

	interface NameFloat {
		x: number;
		y: number;
		text: string;
		opacity: number;
		life: number;
	}

	interface BgStar {
		x: number;
		y: number;
		size: number;
		opacity: number;
		twinkleSpeed: number;
		phase: number;
	}

	const OFFERING_COLORS: [number, number, number][] = [
		[80, 200, 120],
		[198, 33, 229],
		[255, 140, 40],
		[180, 220, 255],
		[255, 255, 200],
		[120, 180, 255],
		[230, 80, 200],
	];

	function initBgStars(w: number, h: number) {
		bgStars = [];
		for (let i = 0; i < 50; i++) {
			bgStars.push({
				x: Math.random() * w,
				y: Math.random() * h,
				size: Math.random() * 1.4 + 0.3,
				opacity: Math.random() * 0.4 + 0.1,
				twinkleSpeed: 0.005 + Math.random() * 0.015,
				phase: Math.random() * Math.PI * 2,
			});
		}
	}

	function initOfferings(w: number, h: number) {
		offerings = [];
		const margin = 80;
		for (let i = 0; i < TOTAL; i++) {
			offerings.push({
				x: margin + Math.random() * (w - margin * 2),
				y: margin + Math.random() * (h - margin * 2),
				vx: (Math.random() - 0.5) * 0.7,
				vy: (Math.random() - 0.5) * 0.7,
				freqX: 0.006 + Math.random() * 0.01,
				freqY: 0.006 + Math.random() * 0.01,
				phaseX: Math.random() * Math.PI * 2,
				phaseY: Math.random() * Math.PI * 2,
				ampX: 0.3 + Math.random() * 0.4,
				ampY: 0.3 + Math.random() * 0.4,
				pulsePhase: Math.random() * Math.PI * 2,
				type: i,
				collected: false,
			});
		}
	}

	function createFireParticle(cx: number, cy: number): FireParticle {
		return {
			x: cx + (Math.random() - 0.5) * 16,
			y: cy,
			vx: (Math.random() - 0.5) * 0.6,
			vy: -(1.2 + Math.random() * 2.0),
			life: 0,
			maxLife: 40 + Math.random() * 50,
			size: 2 + Math.random() * 4,
		};
	}

	function drawBgStars(ctx: CanvasRenderingContext2D) {
		for (const s of bgStars) {
			const twinkle = Math.sin(time * s.twinkleSpeed + s.phase);
			const a = s.opacity * (0.5 + 0.5 * twinkle);
			ctx.beginPath();
			ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
			ctx.fill();
		}
	}

	function drawGlow(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: [number, number, number], alpha: number) {
		const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
		grad.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`);
		grad.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha * 0.3})`);
		grad.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fillStyle = grad;
		ctx.fill();
	}

	function drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(Math.sin(time * 0.01) * 0.15);
		ctx.beginPath();
		ctx.moveTo(0, -s * 1.2);
		ctx.bezierCurveTo(s * 0.8, -s * 0.6, s * 0.8, s * 0.6, 0, s * 1.2);
		ctx.bezierCurveTo(-s * 0.8, s * 0.6, -s * 0.8, -s * 0.6, 0, -s * 1.2);
		ctx.strokeStyle = `rgba(80, 200, 120, 0.9)`;
		ctx.lineWidth = 1.5;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, -s * 0.8);
		ctx.lineTo(0, s * 0.8);
		ctx.strokeStyle = `rgba(80, 200, 120, 0.5)`;
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.restore();
	}

	function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(time * 0.005);
		const petals = 5;
		for (let i = 0; i < petals; i++) {
			const angle = (i / petals) * Math.PI * 2;
			const px = Math.cos(angle) * s * 0.6;
			const py = Math.sin(angle) * s * 0.6;
			ctx.beginPath();
			ctx.arc(px, py, s * 0.4, 0, Math.PI * 2);
			ctx.strokeStyle = `rgba(198, 33, 229, 0.8)`;
			ctx.lineWidth = 1.2;
			ctx.stroke();
		}
		ctx.beginPath();
		ctx.arc(0, 0, s * 0.2, 0, Math.PI * 2);
		ctx.fillStyle = `rgba(255, 200, 255, 0.6)`;
		ctx.fill();
		ctx.restore();
	}

	function drawSmallFlame(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
		ctx.save();
		ctx.translate(x, y);
		const flicker = Math.sin(time * 0.08) * s * 0.1;
		ctx.beginPath();
		ctx.moveTo(0, -s * 1.3);
		ctx.bezierCurveTo(s * 0.5 + flicker, -s * 0.5, s * 0.4, s * 0.3, 0, s * 0.8);
		ctx.bezierCurveTo(-s * 0.4, s * 0.3, -s * 0.5 - flicker, -s * 0.5, 0, -s * 1.3);
		ctx.strokeStyle = `rgba(255, 160, 50, 0.9)`;
		ctx.lineWidth = 1.5;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, -s * 0.7);
		ctx.bezierCurveTo(s * 0.2, -s * 0.2, s * 0.15, s * 0.1, 0, s * 0.3);
		ctx.bezierCurveTo(-s * 0.15, s * 0.1, -s * 0.2, -s * 0.2, 0, -s * 0.7);
		ctx.fillStyle = `rgba(255, 220, 100, 0.5)`;
		ctx.fill();
		ctx.restore();
	}

	function drawCrystal(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(Math.sin(time * 0.007) * 0.1);
		ctx.beginPath();
		ctx.moveTo(0, -s * 1.3);
		ctx.lineTo(s * 0.7, 0);
		ctx.lineTo(0, s * 1.3);
		ctx.lineTo(-s * 0.7, 0);
		ctx.closePath();
		ctx.strokeStyle = `rgba(180, 220, 255, 0.9)`;
		ctx.lineWidth = 1.5;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(0, -s * 1.3);
		ctx.lineTo(0, s * 1.3);
		ctx.moveTo(-s * 0.7, 0);
		ctx.lineTo(s * 0.7, 0);
		ctx.strokeStyle = `rgba(180, 220, 255, 0.3)`;
		ctx.lineWidth = 0.8;
		ctx.stroke();
		ctx.restore();
	}

	function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(time * 0.004);
		const points = 4;
		ctx.beginPath();
		for (let i = 0; i < points * 2; i++) {
			const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
			const r = i % 2 === 0 ? s * 1.2 : s * 0.4;
			const sx = Math.cos(angle) * r;
			const sy = Math.sin(angle) * r;
			if (i === 0) ctx.moveTo(sx, sy);
			else ctx.lineTo(sx, sy);
		}
		ctx.closePath();
		ctx.strokeStyle = `rgba(255, 255, 200, 0.9)`;
		ctx.lineWidth = 1.3;
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(0, 0, s * 0.15, 0, Math.PI * 2);
		ctx.fillStyle = `rgba(255, 255, 240, 0.7)`;
		ctx.fill();
		ctx.restore();
	}

	function drawSpiral(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(time * 0.006);
		ctx.beginPath();
		const turns = 2.5;
		const steps = 60;
		for (let i = 0; i <= steps; i++) {
			const t = (i / steps) * turns * Math.PI * 2;
			const r = (i / steps) * s * 1.1;
			const sx = Math.cos(t) * r;
			const sy = Math.sin(t) * r;
			if (i === 0) ctx.moveTo(sx, sy);
			else ctx.lineTo(sx, sy);
		}
		ctx.strokeStyle = `rgba(120, 180, 255, 0.85)`;
		ctx.lineWidth = 1.3;
		ctx.stroke();
		ctx.restore();
	}

	function drawChakana(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(Math.sin(time * 0.005) * 0.08);
		const u = s * 0.32;
		const shape: [number, number][] = [
			[0, -3], [1, -2], [2, -2], [2, -1],
			[3, 0], [2, 1], [2, 2], [1, 2],
			[0, 3], [-1, 2], [-2, 2], [-2, 1],
			[-3, 0], [-2, -1], [-2, -2], [-1, -2],
		];
		ctx.beginPath();
		for (let i = 0; i < shape.length; i++) {
			const [px, py] = shape[i]!;
			if (i === 0) ctx.moveTo(px * u, py * u);
			else ctx.lineTo(px * u, py * u);
		}
		ctx.closePath();
		ctx.strokeStyle = `rgba(230, 80, 200, 0.85)`;
		ctx.lineWidth = 1.3;
		ctx.stroke();
		ctx.restore();
	}

	const DRAW_FNS = [drawLeaf, drawFlower, drawSmallFlame, drawCrystal, drawStar, drawSpiral, drawChakana];

	function drawOffering(ctx: CanvasRenderingContext2D, o: Offering) {
		const pulse = 0.9 + 0.1 * Math.sin(time * 0.03 + o.pulsePhase);
		const color = OFFERING_COLORS[o.type]!;
		const size = 8 * pulse;

		drawGlow(ctx, o.x, o.y, 22 * pulse, color, 0.3);

		DRAW_FNS[o.type]!(ctx, o.x, o.y, size);
	}

	function drawFirePit(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
		const intensity = firePitGlow;
		for (let i = 3; i >= 1; i--) {
			const r = 20 + i * 18;
			const alpha = intensity * 0.06 * (4 - i);
			const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
			grad.addColorStop(0, `rgba(198, 33, 229, ${alpha})`);
			grad.addColorStop(0.5, `rgba(255, 140, 40, ${alpha * 0.5})`);
			grad.addColorStop(1, "rgba(255, 140, 40, 0)");
			ctx.beginPath();
			ctx.arc(cx, cy, r, 0, Math.PI * 2);
			ctx.fillStyle = grad;
			ctx.fill();
		}

		if (intensity > 0) {
			const stoneR = 55;
			const stones = 8;
			for (let i = 0; i < stones; i++) {
				const angle = (i / stones) * Math.PI * 2;
				const sx = cx + Math.cos(angle) * stoneR;
				const sy = cy + Math.sin(angle) * stoneR;
				ctx.beginPath();
				ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(198, 33, 229, ${intensity * 0.15})`;
				ctx.fill();
			}
		}
	}

	function drawFire(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
		const baseGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
		baseGrad.addColorStop(0, "rgba(255, 175, 70, 0.3)");
		baseGrad.addColorStop(0.5, "rgba(198, 33, 229, 0.1)");
		baseGrad.addColorStop(1, "rgba(198, 33, 229, 0)");
		ctx.beginPath();
		ctx.arc(cx, cy, 50, 0, Math.PI * 2);
		ctx.fillStyle = baseGrad;
		ctx.fill();

		for (const p of fireParticles) {
			p.x += p.vx + Math.sin(time * 0.02 + p.life * 0.1) * 0.3;
			p.y += p.vy;
			p.life++;
			const lifeRatio = p.life / p.maxLife;
			const fadeIn = Math.min(1, p.life / 8);
			const fadeOut = Math.max(0, 1 - lifeRatio);
			const alpha = fadeIn * fadeOut;
			const r = lifeRatio < 0.3 ? 255 : lifeRatio < 0.6 ? 255 : 198;
			const g = lifeRatio < 0.3 ? 240 : lifeRatio < 0.6 ? 140 : 33;
			const b = lifeRatio < 0.3 ? 208 : lifeRatio < 0.6 ? 40 : 229;

			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.1})`;
			ctx.fill();
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size * (1 - lifeRatio * 0.5), 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
			ctx.fill();

			if (p.life >= p.maxLife) Object.assign(p, createFireParticle(cx, cy));
		}
	}

	function drawBursts(ctx: CanvasRenderingContext2D) {
		for (let i = bursts.length - 1; i >= 0; i--) {
			const b = bursts[i]!;
			b.radius += 2.5;
			b.opacity -= 0.025;
			if (b.opacity <= 0) { bursts.splice(i, 1); continue; }
			const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
			grad.addColorStop(0, `rgba(${b.r}, ${b.g}, ${b.b}, ${b.opacity * 0.5})`);
			grad.addColorStop(0.6, `rgba(${b.r}, ${b.g}, ${b.b}, ${b.opacity * 0.15})`);
			grad.addColorStop(1, `rgba(${b.r}, ${b.g}, ${b.b}, 0)`);
			ctx.beginPath();
			ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
			ctx.fillStyle = grad;
			ctx.fill();
		}
	}

	function drawNameFloats(ctx: CanvasRenderingContext2D) {
		for (let i = nameFloats.length - 1; i >= 0; i--) {
			const n = nameFloats[i]!;
			n.y -= 0.8;
			n.life++;
			n.opacity = Math.max(0, 1 - n.life / 70);
			if (n.opacity <= 0) { nameFloats.splice(i, 1); continue; }

			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const fontSize = 14 * dpr;
			ctx.save();
			ctx.font = `500 ${fontSize}px "Satoshi", system-ui, sans-serif`;
			ctx.textAlign = "center";
			ctx.fillStyle = `rgba(245, 245, 245, ${n.opacity})`;
			ctx.shadowColor = `rgba(198, 33, 229, ${n.opacity * 0.6})`;
			ctx.shadowBlur = 12;
			ctx.fillText(n.text, n.x, n.y);
			ctx.restore();
		}
	}

	function animate() {
		if (!canvas || !isOpen) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const { width, height } = canvas;
		ctx.clearRect(0, 0, width, height);
		time++;

		drawBgStars(ctx);

		const cx = width / 2;
		const cy = height * 0.45;

		if (gameState === "playing") {
			drawFirePit(ctx, cx, cy);

			for (const o of offerings) {
				if (o.collected) continue;
				o.x += o.vx + Math.sin(time * o.freqX + o.phaseX) * o.ampX;
				o.y += o.vy + Math.cos(time * o.freqY + o.phaseY) * o.ampY;
				if (o.x < 40 || o.x > width - 40) o.vx *= -1;
				if (o.y < 40 || o.y > height - 40) o.vy *= -1;
				o.x = Math.max(20, Math.min(width - 20, o.x));
				o.y = Math.max(20, Math.min(height - 20, o.y));
				drawOffering(ctx, o);
			}

			drawBursts(ctx);
			drawNameFloats(ctx);
		} else {
			drawFire(ctx, cx, cy);
			drawBursts(ctx);
			drawNameFloats(ctx);
		}

		animId = requestAnimationFrame(animate);
	}

	function handlePointerDown(e: PointerEvent) {
		if (gameState !== "playing" || !canvas) return;

		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
		const px = (e.clientX - rect.left) * scaleX;
		const py = (e.clientY - rect.top) * scaleY;
		const hitR = isMobile ? HIT_R_MOBILE : HIT_R_DESKTOP;

		for (const o of offerings) {
			if (o.collected) continue;
			const dx = px - o.x;
			const dy = py - o.y;
			if (dx * dx + dy * dy < hitR * hitR) {
				o.collected = true;
				collected++;
				firePitGlow = collected / TOTAL;

				const color = OFFERING_COLORS[o.type]!;
				bursts.push({ x: o.x, y: o.y, radius: 6, opacity: 1, r: color[0], g: color[1], b: color[2] });

				const name = offeringNames[o.type] ?? "";
				nameFloats.push({ x: o.x, y: o.y - 20, text: name, opacity: 1, life: 0 });

				if (collected >= TOTAL) setTimeout(activateFire, 600);
				return;
			}
		}
	}

	function activateFire() {
		gameState = "completed";
		if (!canvas) return;
		const cx = canvas.width / 2;
		const cy = canvas.height * 0.45;
		fireParticles = [];
		for (let i = 0; i < FIRE_COUNT; i++) {
			const p = createFireParticle(cx, cy);
			p.life = Math.floor(Math.random() * p.maxLife);
			fireParticles.push(p);
		}
	}

	function open() {
		isOpen = true;
		document.body.style.overflow = "hidden";

		if (prefersReducedMotion) {
			gameState = "completed";
			collected = TOTAL;
			return;
		}

		gameState = "playing";
		collected = 0;
		firePitGlow = 0;
		time = 0;
		bursts = [];
		nameFloats = [];
		fireParticles = [];
	}

	function close() {
		isOpen = false;
		document.body.style.overflow = "";
		cancelAnimationFrame(animId);
	}

	function replay() {
		if (!canvas) return;
		gameState = "playing";
		collected = 0;
		firePitGlow = 0;
		time = 0;
		bursts = [];
		nameFloats = [];
		fireParticles = [];
		initOfferings(canvas.width, canvas.height);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!isOpen) return;
		if (e.key === "Escape") { e.preventDefault(); close(); }
		if (e.key === "Tab" && modalEl) {
			const focusable = modalEl.querySelectorAll<HTMLElement>(
				'button, [href], [tabindex]:not([tabindex="-1"])',
			);
			if (focusable.length === 0) return;
			const first = focusable[0]!;
			const last = focusable[focusable.length - 1]!;
			if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
			else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
		}
	}

	function formatProgress(count: number, total: number): string {
		return progressLabel.replace("{count}", String(count)).replace("{total}", String(total));
	}

	$effect(() => {
		if (!isOpen || !canvas) return;

		isMobile = window.innerWidth < 640;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = canvas.offsetWidth * dpr;
		canvas.height = canvas.offsetHeight * dpr;

		initBgStars(canvas.width, canvas.height);

		if (gameState === "playing") {
			initOfferings(canvas.width, canvas.height);
		} else if (gameState === "completed" && !prefersReducedMotion) {
			activateFire();
		}

		if (!prefersReducedMotion) animate();

		requestAnimationFrame(() => closeBtn?.focus());

		return () => { cancelAnimationFrame(animId); };
	});

	$effect(() => {
		const handler = () => open();
		document.addEventListener("open-ritual-game", handler);
		return () => document.removeEventListener("open-ritual-game", handler);
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<div
		bind:this={modalEl}
		class="ritual-overlay"
		role="dialog"
		aria-modal="true"
		aria-label="Ritual Fire Game"
	>
		<div class="ritual-container">
			<button
				bind:this={closeBtn}
				onclick={close}
				class="ritual-close"
				aria-label={closeLabel}
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>

			{#if gameState === "playing"}
				<p class="ritual-prompt">{promptText}</p>

				<div class="ritual-canvas-wrap">
					<canvas
						bind:this={canvas}
						class="ritual-canvas"
						aria-hidden="true"
						onpointerdown={handlePointerDown}
					></canvas>
				</div>

				<div class="ritual-progress" aria-live="polite">
					<div class="ritual-dots">
						{#each Array(TOTAL) as _, i}
							<span
								class="ritual-dot {i < collected ? 'ritual-dot-filled' : 'ritual-dot-empty'}"
							></span>
						{/each}
					</div>
					<span class="ritual-count">{formatProgress(collected, TOTAL)}</span>
				</div>

				<button onclick={() => { collected = TOTAL; activateFire(); }} class="ritual-skip">
					{skipLabel}
				</button>
			{:else}
				<div class="ritual-completed">
					<div class="ritual-canvas-wrap ritual-canvas-wrap-fire">
						<canvas
							bind:this={canvas}
							class="ritual-canvas"
							aria-hidden="true"
						></canvas>
					</div>

					<div class="ritual-result" role="status">
						<p class="ritual-fire-emoji">🔥</p>
						<h2 class="ritual-title">{completedTitle}</h2>
						<p class="ritual-subtitle">{completedSubtitle}</p>

						<button
							class="ritual-cta"
							data-tally-open="kdA05d"
							data-tally-hide-title="1"
							data-tally-emoji-text="👋"
							data-tally-emoji-animation="wave"
						>
							{ctaText}
						</button>

						<button onclick={replay} class="ritual-replay">
							↻ {replayLabel}
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.ritual-overlay {
		position: fixed;
		inset: 0;
		z-index: 9999;
		background-color: var(--color-bg);
		animation: ritual-fade-in 0.3s ease-out;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	@keyframes ritual-fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.ritual-container {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		gap: 1.25rem;
	}

	.ritual-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 10;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		border: 1px solid var(--color-brand-glow);
		background: transparent;
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: color 0.2s, border-color 0.2s, background-color 0.2s;
	}

	.ritual-close:hover,
	.ritual-close:focus-visible {
		color: var(--color-text-primary);
		border-color: var(--color-brand);
		background-color: var(--color-brand-glow);
	}

	.ritual-close:focus-visible {
		outline: 2px solid var(--color-brand);
		outline-offset: 2px;
	}

	.ritual-prompt {
		font-family: var(--font-satoshi);
		font-weight: 500;
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		text-align: center;
		margin: 0;
	}

	@media (min-width: 640px) {
		.ritual-prompt { font-size: 1.25rem; }
	}

	.ritual-canvas-wrap {
		width: 100%;
		max-width: 700px;
		aspect-ratio: 4 / 3;
		position: relative;
	}

	.ritual-canvas-wrap-fire {
		position: absolute;
		inset: 0;
		max-width: none;
		aspect-ratio: auto;
		pointer-events: none;
	}

	.ritual-canvas {
		width: 100%;
		height: 100%;
		display: block;
		cursor: crosshair;
		touch-action: none;
	}

	.ritual-progress {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.ritual-dots { display: flex; gap: 0.5rem; }

	.ritual-dot {
		width: 10px;
		height: 10px;
		border-radius: 9999px;
		transition: background-color 0.3s, box-shadow 0.3s;
	}

	.ritual-dot-empty { background-color: var(--color-text-muted); }

	.ritual-dot-filled {
		background-color: var(--color-brand);
		box-shadow: 0 0 8px var(--color-brand-glow-strong);
	}

	.ritual-count {
		font-family: var(--font-mono);
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.ritual-skip {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-text-muted);
		background: none;
		border: none;
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 3px;
		transition: color 0.2s;
		padding: 0.5rem 1rem;
	}

	.ritual-skip:hover,
	.ritual-skip:focus-visible { color: var(--color-text-secondary); }

	.ritual-completed {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ritual-result {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		text-align: center;
		animation: ritual-fade-in 0.6s ease-out;
	}

	.ritual-fire-emoji { font-size: 3rem; margin: 0; line-height: 1; }

	.ritual-title {
		font-family: var(--font-inter);
		font-weight: 900;
		font-size: 1.875rem;
		color: var(--color-text-primary);
		margin: 0;
		text-shadow: 0 0 30px var(--color-brand-glow);
	}

	@media (min-width: 640px) { .ritual-title { font-size: 3rem; } }

	.ritual-subtitle {
		font-family: var(--font-satoshi);
		font-weight: 500;
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		margin: 0;
	}

	@media (min-width: 640px) { .ritual-subtitle { font-size: 1.25rem; } }

	.ritual-cta {
		margin-top: 0.5rem;
		padding: 0.75rem 2rem;
		border-radius: 9999px;
		background-color: var(--color-brand);
		color: white;
		font-family: var(--font-satoshi);
		font-weight: 700;
		font-size: 1rem;
		border: none;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
		box-shadow: 0 0 20px var(--color-brand-glow);
	}

	.ritual-cta:hover,
	.ritual-cta:focus-visible {
		transform: scale(1.05);
		box-shadow: 0 0 30px var(--color-brand-glow-strong);
	}

	.ritual-cta:focus-visible {
		outline: 2px solid var(--color-brand);
		outline-offset: 2px;
	}

	.ritual-replay {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--color-text-muted);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem 1rem;
		transition: color 0.2s;
	}

	.ritual-replay:hover,
	.ritual-replay:focus-visible { color: var(--color-text-secondary); }

	@media (prefers-reduced-motion: reduce) {
		.ritual-overlay { animation: none; }
		.ritual-result { animation: none; }
	}
</style>
