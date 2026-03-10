<script lang="ts">
	let canvas: HTMLCanvasElement | undefined = $state();
	let animationId: number;

	interface Particle {
		x: number;
		y: number;
		baseX: number;
		baseY: number;
		vx: number;
		vy: number;
		size: number;
		opacity: number;
		isDiamond: boolean;
	}

	const PARTICLE_COUNT = 90;
	const DIAMOND_COUNT = 12;
	const REPULSION_RADIUS = 180;
	const REPULSION_FORCE = 0.08;

	let mouse = { x: -1000, y: -1000 };
	let particles: Particle[] = [];

	const prefersReducedMotion =
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	function initParticles(width: number, height: number) {
		particles = [];
		const centerX = width / 2;
		const centerY = height / 2;

		for (let i = 0; i < DIAMOND_COUNT; i++) {
			const angle = (i / DIAMOND_COUNT) * Math.PI * 2;
			const radius = 60 + Math.random() * 30;
			particles.push({
				x: centerX + Math.cos(angle) * radius,
				y: centerY + Math.sin(angle) * radius,
				baseX: centerX + Math.cos(angle) * radius,
				baseY: centerY + Math.sin(angle) * radius,
				vx: 0,
				vy: 0,
				size: 2.5,
				opacity: 0.8,
				isDiamond: true,
			});
		}

		for (let i = DIAMOND_COUNT; i < PARTICLE_COUNT; i++) {
			const x = Math.random() * width;
			const y = Math.random() * height;
			particles.push({
				x,
				y,
				baseX: x,
				baseY: y,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				size: Math.random() * 2 + 0.5,
				opacity: Math.random() * 0.5 + 0.1,
				isDiamond: false,
			});
		}
	}

	function animate() {
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const { width, height } = canvas;
		ctx.clearRect(0, 0, width, height);

		for (const p of particles) {
			const dx = mouse.x - p.x;
			const dy = mouse.y - p.y;
			const dist = Math.sqrt(dx * dx + dy * dy);

			if (dist < REPULSION_RADIUS && dist > 0) {
				const force = (REPULSION_RADIUS - dist) / REPULSION_RADIUS;
				p.vx -= (dx / dist) * force * REPULSION_FORCE;
				p.vy -= (dy / dist) * force * REPULSION_FORCE;
			}

			if (!p.isDiamond) {
				p.x += p.vx;
				p.y += p.vy;
				p.vx *= 0.98;
				p.vy *= 0.98;

				if (p.x < 0 || p.x > width) p.vx *= -1;
				if (p.y < 0 || p.y > height) p.vy *= -1;
			} else {
				const returnForce = 0.02;
				p.vx += (p.baseX - p.x) * returnForce;
				p.vy += (p.baseY - p.y) * returnForce;
				p.x += p.vx;
				p.y += p.vy;
				p.vx *= 0.95;
				p.vy *= 0.95;
			}

			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fillStyle = p.isDiamond
				? `rgba(198, 33, 229, ${p.opacity})`
				: `rgba(198, 33, 229, ${p.opacity * 0.5})`;
			ctx.fill();
		}

		for (let i = 0; i < particles.length; i++) {
			for (let j = i + 1; j < particles.length; j++) {
				const a = particles[i]!;
				const b = particles[j]!;
				const dx = a.x - b.x;
				const dy = a.y - b.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < 120) {
					ctx.beginPath();
					ctx.moveTo(a.x, a.y);
					ctx.lineTo(b.x, b.y);
					ctx.strokeStyle = `rgba(198, 33, 229, ${0.05 * (1 - dist / 120)})`;
					ctx.lineWidth = 0.5;
					ctx.stroke();
				}
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
			initParticles(canvas.width, canvas.height);
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
