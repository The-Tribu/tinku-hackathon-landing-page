import type { TranslationKey } from "../i18n";

export interface Prize {
	id: string;
	nameKey: TranslationKey;
	valueKey?: TranslationKey;
	descriptionKey: TranslationKey;
	tier: "main" | "secondary";
}

export const prizes: Prize[] = [
	{
		id: "main",
		nameKey: "prizes.main.name",
		valueKey: "prizes.main.value",
		descriptionKey: "prizes.main.description",
		tier: "main",
	},
	{
		id: "cursor",
		nameKey: "prizes.cursor.name",
		descriptionKey: "prizes.cursor.description",
		tier: "secondary",
	},
	{
		id: "minimax",
		nameKey: "prizes.minimax.name",
		descriptionKey: "prizes.minimax.description",
		tier: "secondary",
	},
	{
		id: "runway",
		nameKey: "prizes.runway.name",
		descriptionKey: "prizes.runway.description",
		tier: "secondary",
	},
];
