const express = require("express");

const fs = require("fs");
const path = require("path");

require("dotenv").config(); // Load environment variables

const app = express();
app.use(express.json());

const { translateText } = require("./googleTranslate");
const { translateWithI18next } = require("./i18nextTranslate");

// Load available languages from the JSON file
const languagesPath = path.join(__dirname, "languages.json");
const languagesData = JSON.parse(fs.readFileSync(languagesPath, "utf8"));
const availableLanguages = languagesData.languages;

// Helper function to get the language code from the full language name
const getLanguageCode = (fullLanguage) =>
  availableLanguages[fullLanguage] || null;

// Helper function to validate input and return appropriate responses
const validateRequest = (textToConvert, fullLanguage) => {
  if (!textToConvert) {
    return {
      valid: false,
      status: 400,
      message: "You need to provide text to translate.",
    };
  }

  const targetLanguage = getLanguageCode(fullLanguage);
  if (!targetLanguage) {
    return {
      valid: false,
      status: 400,
      message: "Invalid language. Please use a valid language name.",
    };
  }

  return { valid: true, targetLanguage };
};

// Route to detect the language and translate the text to a target language using Google Cloud
app.get("/convert-google/:lang/:text", async (req, res) => {
  const { text, lang } = req.params;

  const validation = validateRequest(text, lang);
  if (!validation.valid) {
    return res.status(validation.status).json({
      success: false,
      message: validation.message,
    });
  }

  const result = await translateText(text, validation.targetLanguage);
  return res.status(result.success ? 200 : 500).json(result);
});

// Route using i18next for predefined translations
app.get("/convert-i18next/:lang/:text", async (req, res) => {
  const { text, lang } = req.params;

  const validation = validateRequest(text, lang);
  if (!validation.valid) {
    return res.status(validation.status).json({
      success: false,
      message: validation.message,
    });
  }

  const result = await translateWithI18next(text, validation.targetLanguage);
  return res.status(result.success ? 200 : 500).json(result);
});

// Start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
