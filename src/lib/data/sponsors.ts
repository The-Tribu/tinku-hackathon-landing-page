export interface Sponsor {
	name: string;
	tier: "organizer" | "main" | "technology" | "allies";
	url?: string;
}

export const sponsors: Sponsor[] = [
	{ name: "The Tribu", tier: "organizer" },
	{ name: "Universidad Cooperativa de Colombia", tier: "organizer" },
	{ name: "Techos Rentables", tier: "main" },
	{ name: "Cursor", tier: "technology" },
	{ name: "MiniMax", tier: "technology" },
	{ name: "Runway", tier: "technology" },
	{ name: "Persano", tier: "allies" },
	{ name: "Flavors", tier: "allies" },
	{ name: "La 7 Incluyente", tier: "allies" },
];

export const sponsorTiers = ["main", "technology", "allies"] as const;
