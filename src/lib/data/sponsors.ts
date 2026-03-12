export interface Sponsor {
	name: string;
	tier: "organizer" | "main" | "technology" | "allies";
	url?: string;
	logo?: string;
}

export const sponsors: Sponsor[] = [
	{
		name: "The Tribu",
		tier: "organizer",
		logo: "/images/brand/the-tribu-logo-horizontal.svg",
		url: "https://thetribu.dev"
	},
	{
		name: "Universidad Cooperativa de Colombia",
		tier: "organizer",
		logo: "/images/sponsors/ucc-logo-horizontal.png",
		url: "https://www.ucc.edu.co"
	},
	{
		name: "Techos Rentables",
		tier: "main",
		logo: "/images/sponsors/logo-techos-rentables.png",
		url: "https://techosrentables.com"
	},
	{
		name: "Cursor",
		tier: "technology",
		logo: "/images/sponsors/cursor-horizontal-dark.svg",
		url: "https://cursor.com"
	},
	{
		name: "MiniMax",
		tier: "technology",
		logo: "/images/sponsors/minimax-horizontal.png",
		url: "https://www.minimax.io/"
	},
	{
		name: "Runway",
		tier: "technology",
		logo: "/images/sponsors/runway-horizontal-white.svg",
		url: "https://runwayml.com"
	},
	{
		name: "Persano",
		tier: "allies",
		logo: "/images/sponsors/persano-logo-horizontal.PNG",
		url: "https://www.instagram.com/persano.co"
	},
	{
		name: "Flavors",
		tier: "allies",
		logo: "/images/sponsors/logo-flavors-negative.png",
		url: "https://www.instagram.com/coffe_flavors"
	},
	{
		name: "La 7 Incluyente",
		tier: "allies",
		logo: "/images/sponsors/logo-la7incluyente.png",
		url: "https://www.instagram.com/la7incluyentegf"
	},
	{
		name: "Vinola",
		tier: "allies",
		logo: "/images/sponsors/logo-vinola-horizontal.png",
		url: "https://www.instagram.com/vinolabar/"
	},
];

export const sponsorTiers = ["main", "technology", "allies"] as const;
