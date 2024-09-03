const i18next = require("i18next");

// Function to initialize i18next with dynamic language and resources
async function initializeI18next(
  languageCode = "en",
  fallbackLanguage = "en",
  resources = {}
) {
  return new Promise((resolve, reject) => {
    i18next.init(
      {
        lng: languageCode, // Set the desired language
        fallbackLng: fallbackLanguage, // Fallback language
        resources, // Dynamic resources
      },
      (err, t) => {
        if (err) {
          console.error("Error initializing i18next:", err);
          reject(new Error("i18next initialization error"));
        } else {
          resolve(t);
        }
      }
    );
  });
}

// Function to add translations dynamically
function addTranslations(languageCode, translations) {
  if (!i18next.hasResourceBundle(languageCode, "translation")) {
    i18next.addResourceBundle(languageCode, "translation", translations);
  } else {
    i18next.addResources(languageCode, "translation", translations);
  }
}

// Function to translate text using i18next
async function translateWithI18next(textToConvert, languageCode = "en") {
  try {
    const resources = {
      en: {
        translation: {
          hello_world: "Hello, World", // Example predefined English translation
        },
      },
      ja: {
        translation: {
          hello_world: "こんにちは、世界", // Example predefined Japanese translation
        },
      },
      // Add more languages and translations here as needed
    };

    const t = await initializeI18next(languageCode, "en", resources);

    // Convert input text to a translation key format
    const translationKey = textToConvert.replace(/ /g, "_").toLowerCase();

    // Retrieve translation
    const translatedText = t(translationKey);

    return {
      success: true,
      originalText: textToConvert,
      translatedText: translatedText || "Translation not found", // Handle missing translation
    };
  } catch (error) {
    console.error("Error during i18next translation:", error);

    return {
      success: false,
      message: "i18next translation error",
      error: error.message, // Include error message for debugging
    };
  }
}

module.exports = {
  translateWithI18next,
  addTranslations, // Exporting the function to add translations dynamically
};
