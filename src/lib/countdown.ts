export const EVENT_START = new Date("2026-04-17T18:00:00-05:00");
export const EVENT_END = new Date("2026-04-18T18:00:00-05:00");

export type CountdownState = "PRE_EVENT" | "DURING_EVENT" | "COMPLETED";

export interface CountdownValues {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	state: CountdownState;
}

export function getCountdownState(now: Date): CountdownState {
	if (now < EVENT_START) return "PRE_EVENT";
	if (now < EVENT_END) return "DURING_EVENT";
	return "COMPLETED";
}

export function getCountdownValues(now: Date): CountdownValues {
	const state = getCountdownState(now);

	if (state === "COMPLETED") {
		return { days: 0, hours: 0, minutes: 0, seconds: 0, state };
	}

	const target = state === "PRE_EVENT" ? EVENT_START : EVENT_END;
	const diff = target.getTime() - now.getTime();

	const totalSeconds = Math.max(0, Math.floor(diff / 1000));
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return { days, hours, minutes, seconds, state };
}

export function formatCountdownUnit(value: number): string {
	return String(value).padStart(2, "0");
}
