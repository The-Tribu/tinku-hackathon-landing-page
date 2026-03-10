export interface Sponsor {
	name: string;
	tier: "organizer" | "university" | "technology" | "community";
	url?: string;
}

export const sponsors: Sponsor[] = [
	{ name: "The Tribu", tier: "organizer" },
	{ name: "Universidad Cooperativa de Colombia", tier: "university" },
	{ name: "Cursor", tier: "technology" },
	{ name: "MiniMax", tier: "technology" },
	{ name: "Runway", tier: "technology" },
	{ name: "Persano", tier: "community" },
	{ name: "La 7 Incluyente", tier: "community" },
	{ name: "Techos Renovables", tier: "community" },
];

export const sponsorTiers = ["organizer", "university", "technology", "community"] as const;
