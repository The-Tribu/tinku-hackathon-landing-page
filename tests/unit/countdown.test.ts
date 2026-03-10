import { describe, it, expect } from "vitest";
import {
	getCountdownState,
	getCountdownValues,
	formatCountdownUnit,
	EVENT_START,
	EVENT_END,
} from "@/lib/countdown";

describe("getCountdownState", () => {
	it("returns PRE_EVENT before event start", () => {
		const before = new Date("2025-04-16T12:00:00-05:00");
		expect(getCountdownState(before)).toBe("PRE_EVENT");
	});

	it("returns DURING_EVENT after start but before end", () => {
		const during = new Date("2025-04-17T15:00:00-05:00");
		expect(getCountdownState(during)).toBe("DURING_EVENT");
	});

	it("returns COMPLETED after event end", () => {
		const after = new Date("2025-04-18T10:00:00-05:00");
		expect(getCountdownState(after)).toBe("COMPLETED");
	});

	it("returns DURING_EVENT at exact start time", () => {
		expect(getCountdownState(EVENT_START)).toBe("DURING_EVENT");
	});

	it("returns COMPLETED at exact end time", () => {
		expect(getCountdownState(EVENT_END)).toBe("COMPLETED");
	});
});

describe("getCountdownValues", () => {
	it("returns correct values in PRE_EVENT mode", () => {
		const oneDay = new Date(EVENT_START.getTime() - 86400000);
		const result = getCountdownValues(oneDay);
		expect(result.state).toBe("PRE_EVENT");
		expect(result.days).toBe(1);
		expect(result.hours).toBe(0);
		expect(result.minutes).toBe(0);
		expect(result.seconds).toBe(0);
	});

	it("returns correct values in DURING_EVENT mode", () => {
		const sixHoursIn = new Date(EVENT_START.getTime() + 6 * 3600000);
		const result = getCountdownValues(sixHoursIn);
		expect(result.state).toBe("DURING_EVENT");
		expect(result.days).toBe(0);
		expect(result.hours).toBe(18);
		expect(result.minutes).toBe(0);
		expect(result.seconds).toBe(0);
	});

	it("returns zeros in COMPLETED state", () => {
		const after = new Date("2025-04-19T00:00:00-05:00");
		const result = getCountdownValues(after);
		expect(result.state).toBe("COMPLETED");
		expect(result.days).toBe(0);
		expect(result.hours).toBe(0);
		expect(result.minutes).toBe(0);
		expect(result.seconds).toBe(0);
	});

	it("handles minutes and seconds correctly", () => {
		const offset = EVENT_START.getTime() - (2 * 3600000 + 30 * 60000 + 15000);
		const result = getCountdownValues(new Date(offset));
		expect(result.state).toBe("PRE_EVENT");
		expect(result.hours).toBe(2);
		expect(result.minutes).toBe(30);
		expect(result.seconds).toBe(15);
	});
});

describe("formatCountdownUnit", () => {
	it("pads single digit with zero", () => {
		expect(formatCountdownUnit(5)).toBe("05");
	});

	it("does not pad double digits", () => {
		expect(formatCountdownUnit(12)).toBe("12");
	});

	it("handles zero", () => {
		expect(formatCountdownUnit(0)).toBe("00");
	});
});
