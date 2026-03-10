import type { TranslationKey } from "../i18n";

export interface Track {
	id: string;
	emoji: string;
	nameKey: TranslationKey;
	descriptionKey: TranslationKey;
}

export const tracks: Track[] = [
	{
		id: "sustainability",
		emoji: "♻️",
		nameKey: "tracks.sustainability.name",
		descriptionKey: "tracks.sustainability.description",
	},
	{
		id: "ai",
		emoji: "🤖",
		nameKey: "tracks.ai.name",
		descriptionKey: "tracks.ai.description",
	},
	{
		id: "education",
		emoji: "🎓",
		nameKey: "tracks.education.name",
		descriptionKey: "tracks.education.description",
	},
	{
		id: "cloud-ai",
		emoji: "☁️",
		nameKey: "tracks.cloud_ai.name",
		descriptionKey: "tracks.cloud_ai.description",
	},
	{
		id: "human-agents",
		emoji: "🧑‍💻",
		nameKey: "tracks.human_agents.name",
		descriptionKey: "tracks.human_agents.description",
	},
];
