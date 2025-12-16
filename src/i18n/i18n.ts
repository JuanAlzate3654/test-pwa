import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./en/translation.json";
import es from "./es/translation.json";

const defaultLanguage = "es";

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: defaultLanguage,
		defaultNS: "translation",
		debug: true,
		detection: {
			order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
			caches: ["localStorage"],
		},
		interpolation: {
			escapeValue: false,
		},
		resources: {
			en: { translation: en },
			es: { translation: es },
		},
	})
	.then(() => {
		// i18n initialized successfully
	})
	.catch((err) => {
		console.error("i18n initialization error:", err);
	});

export default i18n;
