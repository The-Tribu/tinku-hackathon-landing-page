import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
	plugins: [svelte({ hot: false })],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			"@components": resolve(__dirname, "src/components"),
			"@layouts": resolve(__dirname, "src/layouts"),
			"@lib": resolve(__dirname, "src/lib"),
			"@styles": resolve(__dirname, "src/styles"),
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		include: ["tests/unit/**/*.test.ts", "tests/component/**/*.test.ts"],
		coverage: {
			provider: "v8",
			include: ["src/lib/**/*.ts", "src/components/**/*.svelte"],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 80,
				statements: 80,
			},
		},
		setupFiles: ["tests/setup.ts"],
	},
});
