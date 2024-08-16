const express = require("express");
const { Translate } = require("@google-cloud/translate").v2;
const i18next = require("i18next");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(express.json());

// Initialize Google Cloud Translation client
const translate = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID, // Set the Google Cloud project ID from environment variables
});

// Route to detect the language and translate the text to a target language (e.g., Japanese)
app.get("/convert-google/:text", async (req, res) => {
  const textToConvert = req.params.text;

  if (!textToConvert) {
    return res.status(400).json({
      success: false,
      message: "You need to provide text to translate.",
    });
  }

  try {
    // Detect the language of the input text
    const [detections] = await translate.detect(textToConvert);
    const detectedLanguage = detections.language;

    // Translate the text to the target language (Japanese in this case)
    const [translation] = await translate.translate(textToConvert, "ja");

    return res.status(200).json({
      success: true,
      originalText: textToConvert,
      detectedLanguage: detectedLanguage, // Return detected language
      translatedText: translation, // Translated text
    });
  } catch (error) {
    console.error("Error during translation:", error);

    return res.status(500).json({
      success: false,
      message: "Translation failed.",
    });
  }
});

// Route using i18next for predefined translations
app.get("/convert-i18next/:text", (req, res) => {
  const textToConvert = req.params.text;

  i18next.init(
    {
      lng: "ja", // Set the default language to Japanese
      fallbackLng: "en", // Fallback language if translation is missing
      resources: {
        en: {
          translation: {
            hello_world: "Hello, World", // Predefined translations
          },
        },
        ja: {
          translation: {
            hello_world: "こんにちは、世界", // Predefined Japanese translation for "Hello, World"
          },
        },
      },
    },
    (err, t) => {
      if (err) {
        console.error("Error initializing i18next:", err);
        return res.status(500).json({
          success: false,
          message: "i18next error",
        });
      }

      // Map input text to a translation key
      const translationKey = textToConvert.replace(/ /g, "_").toLowerCase();

      // Retrieve translation
      const translatedText = t(translationKey);

      return res.status(200).json({
        success: true,
        originalText: textToConvert,
        translatedText: translatedText || "Translation not found", // Handle missing translation
      });
    }
  );
});

// Start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
