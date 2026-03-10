import type { TranslationKey } from "../i18n";

export interface FAQItem {
	id: string;
	questionKey: TranslationKey;
	answerKey: TranslationKey;
}

export const faqItems: FAQItem[] = [
	{ id: "q1", questionKey: "faq.q1.question", answerKey: "faq.q1.answer" },
	{ id: "q2", questionKey: "faq.q2.question", answerKey: "faq.q2.answer" },
	{ id: "q3", questionKey: "faq.q3.question", answerKey: "faq.q3.answer" },
	{ id: "q4", questionKey: "faq.q4.question", answerKey: "faq.q4.answer" },
	{ id: "q5", questionKey: "faq.q5.question", answerKey: "faq.q5.answer" },
	{ id: "q6", questionKey: "faq.q6.question", answerKey: "faq.q6.answer" },
	{ id: "q7", questionKey: "faq.q7.question", answerKey: "faq.q7.answer" },
	{ id: "q8", questionKey: "faq.q8.question", answerKey: "faq.q8.answer" },
];
