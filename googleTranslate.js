const fs = require("fs");
const path = require("path");
const { Translate } = require("@google-cloud/translate").v2;

// Load available languages from the JSON file
const languagesPath = path.join(__dirname, "languages.json");
const languagesData = JSON.parse(fs.readFileSync(languagesPath, "utf8"));
const availableLanguages = languagesData.languages;

const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY, // Set the Google Cloud API key from environment variables
});

// Helper function to get the full language name from the language code
const getLanguageName = (langCode) => {
  return (
    Object.keys(availableLanguages).find(
      (key) => availableLanguages[key] === langCode
    ) || langCode
  );
};

async function translateText(textToConvert, langToConvert) {
  try {
    // Detect the language of the input text
    const [detections] = await translate.detect(textToConvert);
    const detectedLanguageCode = detections.language;
    const detectedLanguageName = getLanguageName(detectedLanguageCode);

    // Translate the text to the target language provided by the user
    const [translation] = await translate.translate(
      textToConvert,
      langToConvert
    );
    const targetLanguageName = getLanguageName(langToConvert);

    return {
      success: true,
      originalText: textToConvert,
      detectedLanguage: {
        code: detectedLanguageCode,
        name: detectedLanguageName,
      },
      targetLanguage: {
        code: langToConvert,
        name: targetLanguageName,
      },
      translatedText: translation, // Translated text
    };
  } catch (error) {
    console.error("Error during translation:", error);

    return {
      success: false,
      message: "Translation failed.",
      error: error.message, // Include error message for debugging
    };
  }
}

module.exports = {
  translateText,
};
