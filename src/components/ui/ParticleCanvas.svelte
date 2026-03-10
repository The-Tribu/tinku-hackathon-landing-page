<script lang="ts">
	let canvas: HTMLCanvasElement | undefined = $state();
	let animationId: number;

	interface Star {
		x: number;
		y: number;
		size: number;
		baseOpacity: number;
		twinkleSpeed: number;
		twinklePhase: number;
		color: [number, number, number];
	}

	interface Ember {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		opacity: number;
		life: number;
		maxLife: number;
	}

	interface ShootingStar {
		x: number;
		y: number;
		vx: number;
		vy: number;
		life: number;
		maxLife: number;
		trail: { x: number; y: number }[];
	}

	interface ConstellationGroup {
		starIndices: number[];
		edges: [number, number][];
	}

	const STAR_COUNT = 130;
	const EMBER_COUNT = 22;
	const REVEAL_RADIUS = 160;

	let mouse = { x: -1000, y: -1000 };
	let stars: Star[] = [];
	let embers: Ember[] = [];
	let constellations: ConstellationGroup[] = [];
	let shootingStar: ShootingStar | null = null;
	let shootingStarTimer = 0;
	let time = 0;

	const prefersReducedMotion =
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	// Chakana (Andean Cross) — stepped cross sacred to Andean cosmology
	const CHAKANA_SHAPE: [number, number][] = [
		[0, -3],
		[1, -2],
		[2, -2],
		[2, -1],
		[3, 0],
		[2, 1],
		[2, 2],
		[1, 2],
		[0, 3],
		[-1, 2],
		[-2, 2],
		[-2, 1],
		[-3, 0],
		[-2, -1],
		[-2, -2],
		[-1, -2],
	];
	const CHAKANA_EDGES: [number, number][] = CHAKANA_SHAPE.map((_, i) => [
		i,
		(i + 1) % CHAKANA_SHAPE.length,
	]);

	// Southern Cross — important in Andean astronomy
	const CRUZ_SHAPE: [number, number][] = [
		[0, -2],
		[0, 2],
		[-1.5, 0],
		[1.5, 0],
		[0, 0],
	];
	const CRUZ_EDGES: [number, number][] = [
		[0, 4],
		[4, 1],
		[2, 4],
		[4, 3],
	];

	// Sacred diamond
	const DIAMOND_SHAPE: [number, number][] = [
		[0, -2.5],
		[2, 0],
		[0, 2.5],
		[-2, 0],
	];
	const DIAMOND_EDGES: [number, number][] = [
		[0, 1],
		[1, 2],
		[2, 3],
		[3, 0],
		[0, 2],
		[1, 3],
	];

	const SHAPES = [
		{ points: CHAKANA_SHAPE, edges: CHAKANA_EDGES },
		{ points: CRUZ_SHAPE, edges: CRUZ_EDGES },
		{ points: DIAMOND_SHAPE, edges: DIAMOND_EDGES },
		{ points: CHAKANA_SHAPE, edges: CHAKANA_EDGES },
	];

	const PALETTE: [number, number, number][] = [
		[255, 255, 255],
		[255, 240, 200],
		[255, 200, 120],
		[198, 33, 229],
		[230, 160, 255],
		[255, 170, 80],
	];

	function pickStarColor(): [number, number, number] {
		const r = Math.random();
		if (r < 0.30) return PALETTE[0]!;
		if (r < 0.50) return PALETTE[1]!;
		if (r < 0.65) return PALETTE[2]!;
		if (r < 0.78) return PALETTE[5]!;
		if (r < 0.90) return PALETTE[4]!;
		return PALETTE[3]!;
	}

	function createEmber(w: number, h: number, scattered = false): Ember {
		return {
			x: Math.random() * w,
			y: scattered ? Math.random() * h : h + Math.random() * 20,
			vx: (Math.random() - 0.5) * 0.25,
			vy: -(0.25 + Math.random() * 0.45),
			size: Math.random() * 1.8 + 0.4,
			opacity: Math.random() * 0.5 + 0.25,
			life: scattered ? Math.random() * 250 : 0,
			maxLife: 220 + Math.random() * 280,
		};
	}

	function initScene(w: number, h: number) {
		stars = [];
		embers = [];
		constellations = [];
		time = 0;
		shootingStar = null;
		shootingStarTimer = 0;

		for (let i = 0; i < STAR_COUNT; i++) {
			stars.push({
				x: Math.random() * w,
				y: Math.random() * h,
				size: Math.random() * 1.8 + 0.3,
				baseOpacity: Math.random() * 0.55 + 0.15,
				twinkleSpeed: 0.006 + Math.random() * 0.018,
				twinklePhase: Math.random() * Math.PI * 2,
				color: pickStarColor(),
			});
		}

		for (let c = 0; c < SHAPES.length; c++) {
			const shape = SHAPES[c]!;
			const cx = w * (0.15 + 0.7 * ((c + 0.5) / SHAPES.length)) + (Math.random() - 0.5) * w * 0.08;
			const cy = h * (0.25 + Math.random() * 0.5);
			const scale = 10 + Math.random() * 10;
			const angle = Math.random() * Math.PI * 2;
			const cosA = Math.cos(angle);
			const sinA = Math.sin(angle);

			const group: ConstellationGroup = { starIndices: [], edges: shape.edges };

			for (const [px, py] of shape.points) {
				const rx = px * cosA - py * sinA;
				const ry = px * sinA + py * cosA;
				group.starIndices.push(stars.length);
				stars.push({
					x: cx + rx * scale,
					y: cy + ry * scale,
					size: 1.2 + Math.random() * 1.2,
					baseOpacity: 0.45 + Math.random() * 0.35,
					twinkleSpeed: 0.008 + Math.random() * 0.012,
					twinklePhase: Math.random() * Math.PI * 2,
					color: Math.random() < 0.45 ? PALETTE[3]! : PALETTE[2]!,
				});
			}

			constellations.push(group);
		}

		for (let i = 0; i < EMBER_COUNT; i++) {
			embers.push(createEmber(w, h, true));
		}
	}

	function animate() {
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const { width, height } = canvas;
		ctx.clearRect(0, 0, width, height);
		time++;

		// Central ritual pulse
		const pulsePhase = Math.sin(time * 0.008) * 0.5 + 0.5;
		const cx = width / 2;
		const cy = height / 2;
		const pulseRadius = 80 + pulsePhase * 60;
		const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseRadius);
		grad.addColorStop(0, `rgba(198, 33, 229, ${0.03 + pulsePhase * 0.025})`);
		grad.addColorStop(1, "rgba(198, 33, 229, 0)");
		ctx.fillStyle = grad;
		ctx.fillRect(cx - pulseRadius, cy - pulseRadius, pulseRadius * 2, pulseRadius * 2);

		// Stars
		for (const star of stars) {
			const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
			const opacity = star.baseOpacity * (0.5 + 0.5 * twinkle);

			const dx = mouse.x - star.x;
			const dy = mouse.y - star.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const boost = dist < REVEAL_RADIUS ? (1 - dist / REVEAL_RADIUS) * 0.45 : 0;

			const finalOpacity = Math.min(1, opacity + boost);
			const [r, g, b] = star.color;

			if (star.size > 1.2 || boost > 0.08) {
				ctx.beginPath();
				ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity * 0.12})`;
				ctx.fill();
			}

			ctx.beginPath();
			ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity})`;
			ctx.fill();
		}

		// Constellation lines — faint, revealed by mouse proximity
		for (const group of constellations) {
			for (const [a, b] of group.edges) {
				const idxA = group.starIndices[a];
				const idxB = group.starIndices[b];
				if (idxA === undefined || idxB === undefined) continue;
				const sA = stars[idxA];
				const sB = stars[idxB];
				if (!sA || !sB) continue;

				const mx = (sA.x + sB.x) / 2;
				const my = (sA.y + sB.y) / 2;
				const dMouse = Math.sqrt((mouse.x - mx) ** 2 + (mouse.y - my) ** 2);

				const baseAlpha = 0.035;
				const revealRange = REVEAL_RADIUS * 1.6;
				const reveal = dMouse < revealRange ? (1 - dMouse / revealRange) * 0.35 : 0;
				const pulse = 0.6 + 0.4 * Math.sin(time * 0.012 + (idxA ?? 0) * 0.15);
				const alpha = (baseAlpha + reveal) * pulse;

				ctx.beginPath();
				ctx.moveTo(sA.x, sA.y);
				ctx.lineTo(sB.x, sB.y);
				ctx.strokeStyle = `rgba(198, 33, 229, ${alpha})`;
				ctx.lineWidth = 0.7;
				ctx.stroke();
			}
		}

		// Rising embers
		for (let i = 0; i < embers.length; i++) {
			const e = embers[i]!;
			e.x += e.vx + Math.sin(time * 0.012 + i * 1.7) * 0.12;
			e.y += e.vy;
			e.life++;

			const lifeRatio = e.life / e.maxLife;
			const fadeIn = Math.min(1, e.life / 40);
			const fadeOut = Math.max(0, 1 - lifeRatio);
			const alpha = e.opacity * fadeIn * fadeOut;

			ctx.beginPath();
			ctx.arc(e.x, e.y, e.size * 3.5, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255, 140, 40, ${alpha * 0.08})`;
			ctx.fill();

			ctx.beginPath();
			ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255, 175, 70, ${alpha})`;
			ctx.fill();

			if (e.life >= e.maxLife || e.y < -10) {
				embers[i] = createEmber(width, height);
			}
		}

		// Shooting star
		shootingStarTimer++;
		if (!shootingStar && shootingStarTimer > 350 + Math.random() * 450) {
			shootingStarTimer = 0;
			const sx = Math.random() * width * 0.7;
			const angle = Math.PI * 0.12 + Math.random() * 0.25;
			shootingStar = {
				x: sx,
				y: -5,
				vx: Math.cos(angle) * 4.5,
				vy: Math.sin(angle) * 4.5,
				life: 0,
				maxLife: 55 + Math.random() * 35,
				trail: [],
			};
		}

		if (shootingStar) {
			shootingStar.trail.push({ x: shootingStar.x, y: shootingStar.y });
			if (shootingStar.trail.length > 18) shootingStar.trail.shift();

			shootingStar.x += shootingStar.vx;
			shootingStar.y += shootingStar.vy;
			shootingStar.life++;

			const len = shootingStar.trail.length;
			for (let i = 1; i < len; i++) {
				const curr = shootingStar.trail[i]!;
				const prev = shootingStar.trail[i - 1]!;
				const a = (i / len) * (1 - shootingStar.life / shootingStar.maxLife) * 0.75;
				ctx.beginPath();
				ctx.moveTo(prev.x, prev.y);
				ctx.lineTo(curr.x, curr.y);
				ctx.strokeStyle = `rgba(255, 235, 190, ${a})`;
				ctx.lineWidth = 1.5 * (i / len);
				ctx.stroke();
			}

			if (shootingStar.life >= shootingStar.maxLife) {
				shootingStar = null;
			}
		}

		animationId = requestAnimationFrame(animate);
	}

	$effect(() => {
		if (!canvas || prefersReducedMotion) return;

		const resize = () => {
			if (!canvas) return;
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
			initScene(canvas.width, canvas.height);
		};

		const handleMouse = (e: MouseEvent) => {
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
		};

		const handleMouseLeave = () => {
			mouse.x = -1000;
			mouse.y = -1000;
		};

		resize();
		animate();

		window.addEventListener("resize", resize);
		canvas.addEventListener("mousemove", handleMouse);
		canvas.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener("resize", resize);
			canvas?.removeEventListener("mousemove", handleMouse);
			canvas?.removeEventListener("mouseleave", handleMouseLeave);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="absolute inset-0 w-full h-full pointer-events-auto"
	aria-hidden="true"
></canvas>
