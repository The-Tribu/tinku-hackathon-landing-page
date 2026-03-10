import type { TranslationKey } from "../i18n";

export interface EvaluationCriterion {
	number: number;
	nameKey: TranslationKey;
	descriptionKey: TranslationKey;
}

export const criteria: EvaluationCriterion[] = [
	{
		number: 1,
		nameKey: "evaluation.originality.name",
		descriptionKey: "evaluation.originality.description",
	},
	{
		number: 2,
		nameKey: "evaluation.technical.name",
		descriptionKey: "evaluation.technical.description",
	},
	{
		number: 3,
		nameKey: "evaluation.viability.name",
		descriptionKey: "evaluation.viability.description",
	},
	{
		number: 4,
		nameKey: "evaluation.pitch.name",
		descriptionKey: "evaluation.pitch.description",
	},
];
