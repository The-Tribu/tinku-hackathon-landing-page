import type { TranslationKey } from "../i18n";

export interface ScheduleEntry {
	time: string;
	nameKey: TranslationKey;
	descriptionKey: TranslationKey;
	isHighlight: boolean;
}

// Schedule entries reference translation keys added below
// For now use a simplified schedule based on event info
export const schedule: ScheduleEntry[] = [];
