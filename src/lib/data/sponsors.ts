export interface Sponsor {
	name: string;
	tier: "organizer" | "main" | "technology" | "allies";
	url?: string;
	logo?: string;
}

export const sponsors: Sponsor[] = [
	{ name: "The Tribu", tier: "organizer" },
	{ name: "Universidad Cooperativa de Colombia", tier: "organizer", logo: "/images/sponsors/ucc-logo-horizontal.png" },
	{ name: "Techos Rentables", tier: "main", logo: "/images/sponsors/logo-techos-rentables.png" },
	{ name: "Cursor", tier: "technology", logo: "/images/sponsors/cursor-horizontal-dark.svg" },
	{ name: "MiniMax", tier: "technology", logo: "/images/sponsors/minimax-horizontal.png" },
	{ name: "Runway", tier: "technology", logo: "/images/sponsors/runway-horizontal-white.svg" },
	{ name: "Persano", tier: "allies", logo: "/images/sponsors/logo-persano.jpeg" },
	{ name: "Flavors", tier: "allies", logo: "/images/sponsors/logo-flavors.png" },
	{ name: "La 7 Incluyente", tier: "allies", logo: "/images/sponsors/logo-la7incluyente.png" },
];

export const sponsorTiers = ["main", "technology", "allies"] as const;
