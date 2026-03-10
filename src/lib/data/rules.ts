import type { TranslationKey } from "../i18n";

export interface Rule {
	id: string;
	emoji: string;
	titleKey: TranslationKey;
	descriptionKey: TranslationKey;
}

export const rules: Rule[] = [
	{
		id: "pitch",
		emoji: "🎤",
		titleKey: "rules.pitch.title",
		descriptionKey: "rules.pitch.description",
	},
	{
		id: "deck",
		emoji: "📊",
		titleKey: "rules.deck.title",
		descriptionKey: "rules.deck.description",
	},
	{
		id: "repo",
		emoji: "💻",
		titleKey: "rules.repo.title",
		descriptionKey: "rules.repo.description",
	},
	{
		id: "product",
		emoji: "🚀",
		titleKey: "rules.product.title",
		descriptionKey: "rules.product.description",
	},
];
