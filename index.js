const express = require("express");

const i18next = require("i18next");
const { Translate } = require("@google-cloud/translate").v2;

const app = express();
app.use(express.json());

// Create a client
const translate = new Translate();

app.post("/convert", async (req, res) => {
  const { text } = req.body;

  console.log("Provided Text : " + text);

  if (!text) {
    return res.status(400).json({
      message: "You need to provide text to translate.",
    });
  }

  try {
    // Translate the text
    const [translation] = await translate.translate(text, "ja");

    console.log(`English Text: ${text} -> Japanese Text: ${translation}`);

    return res.status(200).json({
      success: true,
      convertedText: translation,
    });
  } catch (error) {
    console.error("Error during translation:", error);
    return res.status(500).json({
      success: false,
      message: "Translation failed.",
    });
  }
});

app.get("/convert-to-japanese/:text", async (req, res) => {
  const textToConvert = req.params.text;

  i18next.init(
    {
      lng: "ja", // Set the default language to Japanese
      fallbackLng: "en", // Fallback language if the translation is missing
      resources: {
        en: {
          translation: {
            hello_world: "Hello, World",
          },
        },
        ja: {
          translation: {
            hello_world: "こんにちは、世界", // Translation for "Hello, World" in Japanese
          },
        },
      },
    },
    (err, t) => {
      if (err) {
        console.error("Error initializing i18next:", err);
        return res
          .status(500)
          .json({ success: false, message: "i18next error" });
      }

      // Check if the text to convert exists in the translations
      const translationKey = textToConvert.replace(/ /g, "_").toLowerCase();

      // Use `t()` function to get the translation
      const translatedText = t(translationKey);

      // Return response
      return res.status(200).json({
        success: true,
        originalText: textToConvert,
        convertedText: translatedText || "Translation not found", // Fallback in case translation is not available
      });
    }
  );
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
