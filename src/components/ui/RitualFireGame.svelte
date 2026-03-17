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
		rewardTitle: string;
		rewardIntro: string;
		rewardStep1: string;
		rewardStep2: string;
		rewardFooter: string;
		rewardCta: string;
		shareHeadline: string;
		shareSubline: string;
		shareSponsor: string;
		shareSponsorDetail: string;
		shareTagline: string;
		shareGenerating: string;
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
		rewardTitle,
		rewardIntro,
		rewardStep1,
		rewardStep2,
		rewardFooter,
		rewardCta,
		shareHeadline,
		shareSubline,
		shareSponsor,
		shareSponsorDetail,
		shareTagline,
		shareGenerating,
	}: Props = $props();

	const TOTAL = 7;
	const HIT_R_DESKTOP = 34;
	const HIT_R_MOBILE = 50;
	const FIRE_COUNT = 45;

	let isOpen = $state(false);
	let gameState: "playing" | "transitioning" | "completed" = $state("playing");
	let collected = $state(0);
	let isGenerating = $state(false);
	let canvas: HTMLCanvasElement | undefined = $state();
	let modalEl: HTMLDivElement | undefined = $state();
	let closeBtn: HTMLButtonElement | undefined = $state();
	let animId = 0;
	let time = 0;
	let cursorX = -100;
	let cursorY = -100;
	let cursorVisible = false;
	let cursorTrail: { x: number; y: number; age: number }[] = [];
	let offerings: Offering[] = [];
	let fireParticles: FireParticle[] = [];
	let bursts: Burst[] = [];
	let nameFloats: NameFloat[] = [];
	let bgStars: BgStar[] = [];
	let firePitGlow = 0;
	let isMobile = false;
	let transitionFrame = 0;
	let vortexParticles: VortexParticle[] = [];
	let shockwaves: Shockwave[] = [];

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

	interface VortexParticle {
		x: number;
		y: number;
		angle: number;
		radius: number;
		speed: number;
		color: [number, number, number];
		size: number;
		opacity: number;
	}

	interface Shockwave {
		x: number;
		y: number;
		radius: number;
		maxRadius: number;
		opacity: number;
		lineWidth: number;
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

	function drawMountains(ctx: CanvasRenderingContext2D, w: number, h: number) {
		const layers: { baseY: number; amplitude: number; segments: number; color: string; edgeGlow: string }[] = [
			{ baseY: h * 0.68, amplitude: h * 0.18, segments: 5, color: "rgba(8, 6, 20, 0.7)", edgeGlow: "rgba(198, 33, 229, 0.03)" },
			{ baseY: h * 0.75, amplitude: h * 0.14, segments: 7, color: "rgba(6, 4, 16, 0.8)", edgeGlow: "rgba(198, 33, 229, 0.05)" },
			{ baseY: h * 0.82, amplitude: h * 0.10, segments: 9, color: "rgba(4, 2, 12, 0.9)", edgeGlow: "rgba(198, 33, 229, 0.04)" },
		];

		for (const layer of layers) {
			ctx.beginPath();
			ctx.moveTo(0, h);

			const segW = w / layer.segments;
			const sway = Math.sin(time * 0.001) * 2;

			ctx.lineTo(0, layer.baseY + Math.sin(0.3) * layer.amplitude * 0.4);

			for (let i = 0; i <= layer.segments; i++) {
				const x = i * segW;
				const peakOffset = Math.sin(i * 2.3 + 0.7) * layer.amplitude;
				const valley = Math.cos(i * 1.7 + 1.2) * layer.amplitude * 0.3;
				const y = layer.baseY - Math.abs(peakOffset) + valley + sway;

				if (i === 0) {
					ctx.lineTo(x, y);
				} else {
					const prevX = (i - 1) * segW;
					const cpX = (prevX + x) / 2;
					ctx.quadraticCurveTo(cpX, y - Math.abs(peakOffset) * 0.15, x, y);
				}
			}

			ctx.lineTo(w, h);
			ctx.closePath();

			ctx.fillStyle = layer.color;
			ctx.fill();

			ctx.strokeStyle = layer.edgeGlow;
			ctx.lineWidth = 1.5;
			ctx.stroke();
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
		const size = 24 * pulse;

		drawGlow(ctx, o.x, o.y, 56 * pulse, color, 0.3);

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

	function drawCursor(ctx: CanvasRenderingContext2D) {
		if (!cursorVisible || isMobile) return;

		cursorTrail.push({ x: cursorX, y: cursorY, age: 0 });
		if (cursorTrail.length > 8) cursorTrail.shift();

		for (const p of cursorTrail) {
			const alpha = Math.max(0, 1 - p.age / 8) * 0.25;
			const r = 6 - p.age * 0.5;
			if (r > 0) {
				ctx.beginPath();
				ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(198, 33, 229, ${alpha})`;
				ctx.fill();
			}
			p.age++;
		}

		const pulse = 0.85 + 0.15 * Math.sin(time * 0.06);
		const outerR = 18 * pulse;
		const innerR = 4;

		const glow = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, outerR * 1.8);
		glow.addColorStop(0, "rgba(198, 33, 229, 0.12)");
		glow.addColorStop(1, "rgba(198, 33, 229, 0)");
		ctx.beginPath();
		ctx.arc(cursorX, cursorY, outerR * 1.8, 0, Math.PI * 2);
		ctx.fillStyle = glow;
		ctx.fill();

		ctx.beginPath();
		ctx.arc(cursorX, cursorY, outerR, 0, Math.PI * 2);
		ctx.strokeStyle = `rgba(198, 33, 229, ${0.5 * pulse})`;
		ctx.lineWidth = 1.5;
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(cursorX, cursorY, innerR, 0, Math.PI * 2);
		ctx.fillStyle = `rgba(255, 240, 208, ${0.7 * pulse})`;
		ctx.fill();
	}

	function initVortexParticles(cx: number, cy: number, w: number, h: number) {
		vortexParticles = [];
		const maxDist = Math.max(w, h) * 0.45;
		for (let i = 0; i < TOTAL; i++) {
			const color = OFFERING_COLORS[i]!;
			for (let j = 0; j < 10; j++) {
				const angle = Math.random() * Math.PI * 2;
				const dist = 60 + Math.random() * maxDist;
				vortexParticles.push({
					x: cx + Math.cos(angle) * dist,
					y: cy + Math.sin(angle) * dist,
					angle,
					radius: dist,
					speed: 0.04 + Math.random() * 0.03,
					color,
					size: 2 + Math.random() * 4,
					opacity: 0.7 + Math.random() * 0.3,
				});
			}
		}
	}

	function drawVortex(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
		for (const p of vortexParticles) {
			p.angle += p.speed * 1.8;
			p.radius *= 0.965;
			p.x = cx + Math.cos(p.angle) * p.radius;
			p.y = cy + Math.sin(p.angle) * p.radius;

			const fadeOut = Math.min(1, p.radius / 20);
			const a = p.opacity * fadeOut;
			if (a <= 0.01) continue;

			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${a * 0.12})`;
			ctx.fill();

			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${a})`;
			ctx.fill();
		}
	}

	function drawShockwaveRings(ctx: CanvasRenderingContext2D) {
		for (let i = shockwaves.length - 1; i >= 0; i--) {
			const s = shockwaves[i]!;
			s.radius += 5;
			s.opacity *= 0.955;
			if (s.opacity < 0.01) { shockwaves.splice(i, 1); continue; }

			const fade = Math.max(0.2, 1 - s.radius / s.maxRadius);
			ctx.beginPath();
			ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
			ctx.strokeStyle = `rgba(198, 33, 229, ${s.opacity * fade})`;
			ctx.lineWidth = s.lineWidth * fade;
			ctx.stroke();
		}
	}

	function drawTransitionFlash(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number) {
		if (intensity <= 0) return;
		ctx.fillStyle = `rgba(255, 235, 210, ${intensity})`;
		ctx.fillRect(0, 0, w, h);
	}

	function drawTransition(ctx: CanvasRenderingContext2D, w: number, h: number, cx: number, cy: number) {
		transitionFrame++;
		const f = transitionFrame;

		const glowIntensity = Math.min(1, f / 45);
		const glowR = 60 + glowIntensity * 220;
		const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
		glowGrad.addColorStop(0, `rgba(255, 200, 150, ${glowIntensity * 0.35})`);
		glowGrad.addColorStop(0.3, `rgba(198, 33, 229, ${glowIntensity * 0.18})`);
		glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
		ctx.beginPath();
		ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
		ctx.fillStyle = glowGrad;
		ctx.fill();

		if (f <= 65) {
			drawVortex(ctx, cx, cy);
		}

		if (f > 35) {
			const spawnRate = Math.min(4, Math.floor((f - 35) / 8) + 1);
			for (let i = 0; i < spawnRate; i++) {
				if (fireParticles.length < FIRE_COUNT * 2) {
					fireParticles.push(createFireParticle(cx, cy));
				}
			}
			drawFire(ctx, cx, cy);
		}

		if (f === 45 || f === 62 || f === 82) {
			shockwaves.push({
				x: cx, y: cy,
				radius: 5,
				maxRadius: Math.max(w, h) * 0.5,
				opacity: 0.7,
				lineWidth: 4,
			});
		}
		drawShockwaveRings(ctx);

		if (f > 80 && f < 128) {
			const progress = (f - 80) / 48;
			const peak = progress < 0.22
				? progress / 0.22
				: Math.max(0, 1 - (progress - 0.22) / 0.78);
			drawTransitionFlash(ctx, w, h, peak * 0.55);
		}

		if (f >= 148) {
			gameState = "completed";
		}
	}

	function handlePointerMove(e: PointerEvent) {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		cursorX = (e.clientX - rect.left) * (canvas.width / rect.width);
		cursorY = (e.clientY - rect.top) * (canvas.height / rect.height);
		cursorVisible = true;
	}

	function handlePointerLeave() {
		cursorVisible = false;
		cursorTrail = [];
	}

	function animate() {
		if (!canvas || !isOpen) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const { width, height } = canvas;
		ctx.clearRect(0, 0, width, height);
		time++;

		drawBgStars(ctx);
		drawMountains(ctx, width, height);

		const cx = width / 2;
		const cy = gameState === "completed" ? height * 0.85 : height * 0.45;

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
			drawCursor(ctx);
		} else if (gameState === "transitioning") {
			drawTransition(ctx, width, height, cx, cy);
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
		gameState = "transitioning";
		transitionFrame = 0;
		vortexParticles = [];
		shockwaves = [];
		fireParticles = [];
	}

	function setChromeVisibility(visible: boolean) {
		const display = visible ? "" : "none";
		const header = document.querySelector("header");
		const sectionNav = document.querySelector('nav[role="navigation"]');
		if (header) (header as HTMLElement).style.display = display;
		if (sectionNav) (sectionNav as HTMLElement).style.display = display;
	}

	function open() {
		isOpen = true;
		document.body.style.overflow = "hidden";
		setChromeVisibility(false);

		if (prefersReducedMotion) {
			gameState = "completed";
			collected = TOTAL;
			return;
		}

		gameState = "playing";
		collected = 0;
		firePitGlow = 0;
		time = 0;
		transitionFrame = 0;
		vortexParticles = [];
		shockwaves = [];
		bursts = [];
		nameFloats = [];
		fireParticles = [];
		cursorTrail = [];
		cursorVisible = false;
	}

	function close() {
		isOpen = false;
		document.body.style.overflow = "";
		setChromeVisibility(true);
		cancelAnimationFrame(animId);
		cursorTrail = [];
		cursorVisible = false;
	}

	function replay() {
		if (!canvas) return;
		gameState = "playing";
		collected = 0;
		firePitGlow = 0;
		time = 0;
		transitionFrame = 0;
		vortexParticles = [];
		shockwaves = [];
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

	function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
		const words = text.split(" ");
		const lines: string[] = [];
		let current = "";
		for (const word of words) {
			const test = current ? `${current} ${word}` : word;
			if (ctx.measureText(test).width > maxWidth && current) {
				lines.push(current);
				current = word;
			} else {
				current = test;
			}
		}
		if (current) lines.push(current);
		return lines;
	}

	function loadImage(src: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = src;
		});
	}

	function drawShareCard(c: HTMLCanvasElement, logoImg: HTMLImageElement | null) {
		const W = 1080;
		const H = 1920;
		c.width = W;
		c.height = H;
		const ctx = c.getContext("2d")!;

		const bg = ctx.createLinearGradient(0, 0, 0, H);
		bg.addColorStop(0, "#06081a");
		bg.addColorStop(0.4, "#020617");
		bg.addColorStop(1, "#0a0220");
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, W, H);

		for (let i = 0; i < 80; i++) {
			const sx = Math.random() * W;
			const sy = Math.random() * H;
			const sr = Math.random() * 1.5 + 0.3;
			const sa = Math.random() * 0.5 + 0.1;
			ctx.beginPath();
			ctx.arc(sx, sy, sr, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255,255,255,${sa})`;
			ctx.fill();
		}

		const cx = W / 2;
		const giftY = 560;
		const fireY = giftY - 20;

		const outerGlow = ctx.createRadialGradient(cx, fireY, 0, cx, fireY, 300);
		outerGlow.addColorStop(0, "rgba(198,33,229,0.22)");
		outerGlow.addColorStop(0.35, "rgba(255,140,40,0.08)");
		outerGlow.addColorStop(1, "rgba(0,0,0,0)");
		ctx.fillStyle = outerGlow;
		ctx.fillRect(0, fireY - 300, W, 600);

		const coreGlow = ctx.createRadialGradient(cx, fireY, 0, cx, fireY, 120);
		coreGlow.addColorStop(0, "rgba(255,240,208,0.3)");
		coreGlow.addColorStop(0.25, "rgba(255,175,70,0.18)");
		coreGlow.addColorStop(0.6, "rgba(198,33,229,0.1)");
		coreGlow.addColorStop(1, "rgba(0,0,0,0)");
		ctx.beginPath();
		ctx.arc(cx, fireY, 120, 0, Math.PI * 2);
		ctx.fillStyle = coreGlow;
		ctx.fill();

		const sparkCount = 40;
		for (let i = 0; i < sparkCount; i++) {
			const angle = Math.random() * Math.PI * 2;
			const dist = 15 + Math.random() * 130;
			const px = cx + Math.cos(angle) * dist * 0.5;
			const py = fireY - Math.random() * 200 - 10;
			const pr = 1.5 + Math.random() * 3;
			const life = Math.random();
			const r = life < 0.3 ? 255 : life < 0.6 ? 255 : 198;
			const g = life < 0.3 ? 240 : life < 0.6 ? 140 : 33;
			const b = life < 0.3 ? 208 : life < 0.6 ? 40 : 229;
			const pa = 0.3 + Math.random() * 0.6;
			ctx.beginPath();
			ctx.arc(px, py, pr * 2.5, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${r},${g},${b},${pa * 0.15})`;
			ctx.fill();
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${r},${g},${b},${pa})`;
			ctx.fill();
		}

		ctx.font = "80px serif";
		ctx.textAlign = "center";
		ctx.fillText("🎁", cx, giftY);

		const headFont = "'Inter', 'SF Pro Display', 'Segoe UI', system-ui, sans-serif";
		const bodyFont = "'Satoshi', 'SF Pro Text', 'Segoe UI', system-ui, sans-serif";
		const monoFont = "'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace";

		ctx.textAlign = "center";

		// --- Headline (forced two lines via narrow max width) ---
		ctx.font = `900 56px ${headFont}`;
		ctx.fillStyle = "#f5f5f5";
		ctx.shadowColor = "rgba(198,33,229,0.5)";
		ctx.shadowBlur = 30;
		const headLines = wrapText(ctx, shareHeadline, 580);
		let y = 650;
		for (const line of headLines) {
			ctx.fillText(line, cx, y);
			y += 68;
		}
		ctx.shadowBlur = 0;

		// --- Date/time right under the headline ---
		y += 12;
		const now = new Date();
		const timestamp = now.toLocaleString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
		ctx.font = `400 28px ${monoFont}`;
		ctx.fillStyle = "rgba(161,161,196,0.6)";
		ctx.fillText(timestamp, cx, y);

		// --- Divider ---
		y += 50;
		ctx.beginPath();
		const lineW = 200;
		const lineGrad = ctx.createLinearGradient(cx - lineW / 2, y, cx + lineW / 2, y);
		lineGrad.addColorStop(0, "rgba(198,33,229,0)");
		lineGrad.addColorStop(0.5, "rgba(198,33,229,0.6)");
		lineGrad.addColorStop(1, "rgba(198,33,229,0)");
		ctx.strokeStyle = lineGrad;
		ctx.lineWidth = 2;
		ctx.moveTo(cx - lineW / 2, y);
		ctx.lineTo(cx + lineW / 2, y);
		ctx.stroke();

		// --- Sponsor block ---
		y += 60;
		ctx.font = `500 36px ${bodyFont}`;
		ctx.fillStyle = "#a1a1c4";
		ctx.fillText(shareSubline, cx, y);

		y += 64;
		ctx.font = `900 52px ${headFont}`;
		ctx.fillStyle = "#c621e5";
		ctx.shadowColor = "rgba(198,33,229,0.5)";
		ctx.shadowBlur = 20;
		ctx.fillText(shareSponsor, cx, y);
		ctx.shadowBlur = 0;

		y += 52;
		ctx.font = `500 34px ${bodyFont}`;
		ctx.fillStyle = "#a1a1c4";
		ctx.fillText(shareSponsorDetail, cx, y);

		// --- Empty square for user to add tags ---
		y += 80;
		const boxW = 700;
		const boxH = 280;
		const boxX = cx - boxW / 2;
		const boxY = y;

		ctx.strokeStyle = "rgba(198,33,229,0.3)";
		ctx.lineWidth = 2;
		ctx.setLineDash([10, 8]);
		ctx.beginPath();
		ctx.roundRect(boxX, boxY, boxW, boxH, 16);
		ctx.stroke();
		ctx.setLineDash([]);

		ctx.fillStyle = "rgba(198,33,229,0.04)";
		ctx.beginPath();
		ctx.roundRect(boxX, boxY, boxW, boxH, 16);
		ctx.fill();

		ctx.font = `500 30px ${bodyFont}`;
		ctx.fillStyle = "rgba(161,161,196,0.45)";
		ctx.fillText("@", cx, boxY + boxH / 2 + 10);

		// --- Bottom branding ---
		y = H - 180;
		ctx.beginPath();
		const divW2 = 160;
		const divGrad = ctx.createLinearGradient(cx - divW2 / 2, y, cx + divW2 / 2, y);
		divGrad.addColorStop(0, "rgba(198,33,229,0)");
		divGrad.addColorStop(0.5, "rgba(198,33,229,0.35)");
		divGrad.addColorStop(1, "rgba(198,33,229,0)");
		ctx.strokeStyle = divGrad;
		ctx.lineWidth = 1;
		ctx.moveTo(cx - divW2 / 2, y);
		ctx.lineTo(cx + divW2 / 2, y);
		ctx.stroke();

		y += 50;
		if (logoImg) {
			const logoH = 150;
			const logoW = logoH * (logoImg.naturalWidth / logoImg.naturalHeight);
			ctx.shadowColor = "rgba(198,33,229,0.4)";
			ctx.shadowBlur = 20;
			ctx.drawImage(logoImg, cx - logoW / 2, y - logoH * 0.7, logoW, logoH);
			ctx.shadowBlur = 0;
		} else {
			ctx.font = `900 64px ${headFont}`;
			ctx.fillStyle = "#f5f5f5";
			ctx.shadowColor = "rgba(198,33,229,0.4)";
			ctx.shadowBlur = 20;
			ctx.fillText("TINKU", cx, y);
			ctx.shadowBlur = 0;
		}

		y += 48;
		ctx.font = `500 30px ${bodyFont}`;
		ctx.fillStyle = "#a1a1c4";
		ctx.fillText(shareTagline, cx, y);
	}

	async function generateAndShareImage() {
		if (isGenerating) return;
		isGenerating = true;

		try {
			let logoImg: HTMLImageElement | null = null;
			try {
				logoImg = await loadImage("/images/brand/tinku-logo-h16.png");
			} catch { /* falls back to text */ }

			const shareCanvas = document.createElement("canvas");
			drawShareCard(shareCanvas, logoImg);

			const blob = await new Promise<Blob | null>((resolve) =>
				shareCanvas.toBlob(resolve, "image/png"),
			);
			if (!blob) return;

			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "tinku-easter-egg.png";
			a.click();
			setTimeout(() => URL.revokeObjectURL(url), 1000);
		} finally {
			isGenerating = false;
		}
	}

	$effect(() => {
		if (!isOpen || !canvas) return;

		isMobile = window.innerWidth < 640;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = canvas.offsetWidth * dpr;
		canvas.height = canvas.offsetHeight * dpr;

		initBgStars(canvas.width, canvas.height);

		const cx = canvas.width / 2;
		const cy = gameState === "completed" ? canvas.height * 0.85 : canvas.height * 0.45;

		if (gameState === "playing") {
			initOfferings(canvas.width, canvas.height);
		} else if (gameState === "transitioning") {
			initVortexParticles(cx, cy, canvas.width, canvas.height);
		} else if (gameState === "completed" && !prefersReducedMotion) {
			if (fireParticles.length === 0) {
				for (let i = 0; i < FIRE_COUNT; i++) {
					const p = createFireParticle(cx, cy);
					p.life = Math.floor(Math.random() * p.maxLife);
					fireParticles.push(p);
				}
			}
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
			<div class="ritual-canvas-wrap ritual-canvas-wrap-fullscreen">
				<canvas
					bind:this={canvas}
					class="ritual-canvas ritual-canvas-playing"
					aria-hidden="true"
					onpointerdown={handlePointerDown}
					onpointermove={handlePointerMove}
					onpointerleave={handlePointerLeave}
				></canvas>
			</div>

			<p class="ritual-prompt ritual-prompt-overlay">{promptText}</p>

			<div class="ritual-progress ritual-progress-overlay" aria-live="polite">
				<div class="ritual-dots">
					{#each Array(TOTAL) as _, i}
						<span
							class="ritual-dot {i < collected ? 'ritual-dot-filled' : 'ritual-dot-empty'}"
						></span>
					{/each}
				</div>
				<span class="ritual-count">{formatProgress(collected, TOTAL)}</span>
			</div>

			<button onclick={() => { collected = TOTAL; activateFire(); }} class="ritual-skip ritual-skip-overlay">
				{skipLabel}
			</button>
		{:else}
			<div class="ritual-completed">
				{#if gameState === "transitioning"}
					<div class="ritual-canvas-wrap ritual-canvas-wrap-fire">
						<canvas
							bind:this={canvas}
							class="ritual-canvas"
							aria-hidden="true"
						></canvas>
					</div>
				{/if}

				{#if gameState === "completed"}
					<div class="ritual-result" role="status">
						<div class="ritual-reward">
							<div class="ritual-fire-inline ritual-stagger" style="--stagger:0">
								<canvas
									bind:this={canvas}
									class="ritual-canvas"
									aria-hidden="true"
								></canvas>
							</div>
							<h2 class="ritual-reward-title ritual-stagger" style="--stagger:1">{rewardTitle}</h2>
							<p class="ritual-reward-intro ritual-stagger" style="--stagger:2">{rewardIntro}</p>

							<ol class="ritual-reward-steps ritual-stagger" style="--stagger:3">
								<li>{rewardStep1}</li>
								<li>{rewardStep2}</li>
							</ol>

							<p class="ritual-reward-footer ritual-stagger" style="--stagger:4">{rewardFooter}</p>

							<div class="ritual-reward-handles ritual-stagger" style="--stagger:5">
								<a
									href="https://www.instagram.com/dra.karen.norena/"
									target="_blank"
									rel="noopener noreferrer"
									class="ritual-handle"
								>@dra.karen.norena</a>
								<span class="ritual-handle-sep">&</span>
								<a
									href="https://www.instagram.com/TheTribu.dev/"
									target="_blank"
									rel="noopener noreferrer"
									class="ritual-handle"
								>@TheTribu.dev</a>
							</div>
						</div>

						<button
							class="ritual-cta ritual-stagger"
							style="--stagger:6"
							onclick={generateAndShareImage}
							disabled={isGenerating}
							data-gtag-label="share_ritual_game"
						>
							{isGenerating ? shareGenerating : rewardCta}
						</button>

						<button onclick={replay} class="ritual-replay ritual-stagger" style="--stagger:7">
							↻ {replayLabel}
						</button>
					</div>
				{/if}
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

	.ritual-canvas-wrap-fullscreen {
		position: absolute;
		inset: 0;
		max-width: none;
		aspect-ratio: auto;
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
		touch-action: none;
	}

	.ritual-canvas-playing {
		cursor: none;
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

	.ritual-prompt-overlay {
		position: absolute;
		top: 4.5rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 5;
		pointer-events: none;
		text-shadow: 0 2px 8px var(--color-bg);
	}

	.ritual-progress-overlay {
		position: absolute;
		bottom: calc(5rem + 50px);
		left: 50%;
		transform: translateX(-50%);
		z-index: 5;
		pointer-events: none;
	}

	.ritual-skip-overlay {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 5;
	}

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
		gap: 1.25rem;
		text-align: center;
		max-width: 520px;
		padding: 0 1rem;
	}

	.ritual-reward {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.125rem;
		text-align: center;
	}

	.ritual-reward-emoji { font-size: 2.5rem; margin: 0; line-height: 1; }

	.ritual-fire-inline {
		width: 140px;
		height: 140px;
		position: relative;
		border-radius: 9999px;
		overflow: hidden;
	}

	.ritual-fire-inline canvas {
		width: 100%;
		height: 100%;
		display: block;
	}

	.ritual-reward-title {
		font-family: var(--font-inter);
		font-weight: 900;
		font-size: 1.5rem;
		color: var(--color-text-primary);
		margin: 0 0 32px;
		text-shadow: 0 0 30px var(--color-brand-glow);
	}

	@media (min-width: 640px) { .ritual-reward-title { font-size: 2rem; } }

	.ritual-reward-intro {
		font-family: var(--font-satoshi);
		font-weight: 500;
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
		margin: 0;
		line-height: 1.6;
	}

	@media (min-width: 640px) { .ritual-reward-intro { font-size: 1.0625rem; } }

	.ritual-reward-steps {
		text-align: left;
		list-style: decimal;
		padding-left: 1.25rem;
		margin: 0.25rem 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-family: var(--font-satoshi);
		font-weight: 500;
		font-size: 0.9375rem;
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	@media (min-width: 640px) { .ritual-reward-steps { font-size: 1rem; } }

	.ritual-reward-steps li::marker {
		color: var(--color-brand);
		font-weight: 700;
	}

	.ritual-reward-footer {
		font-family: var(--font-satoshi);
		font-weight: 700;
		font-size: 0.875rem;
		color: var(--color-brand);
		margin: 0.5rem 0 0;
		text-shadow: 0 0 12px var(--color-brand-glow);
	}

	@media (min-width: 640px) { .ritual-reward-footer { font-size: 0.9375rem; } }

	.ritual-reward-handles {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.ritual-handle {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--color-brand);
		text-decoration: none;
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		border: 1px solid var(--color-brand-glow);
		transition: background-color 0.2s, box-shadow 0.2s;
	}

	.ritual-handle:hover,
	.ritual-handle:focus-visible {
		background-color: var(--color-brand-glow);
		box-shadow: 0 0 12px var(--color-brand-glow-strong);
	}

	.ritual-handle-sep {
		font-family: var(--font-satoshi);
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.ritual-cta {
		margin-top: 1rem;
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

	.ritual-cta:disabled {
		opacity: 0.6;
		cursor: wait;
		transform: none;
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

	@keyframes ritual-stagger-in {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.ritual-stagger {
		opacity: 0;
		animation: ritual-stagger-in 0.5s ease-out forwards;
		animation-delay: calc(var(--stagger, 0) * 0.09s + 0.1s);
	}

	@media (prefers-reduced-motion: reduce) {
		.ritual-overlay { animation: none; }
		.ritual-stagger {
			animation: none;
			opacity: 1;
			transform: none;
		}
	}
</style>
