# Multi-Language Translator

A Node.js application that translates text between languages using both i18next for predefined translations and the Google Translation API for dynamic text translation.

## Features

- **i18next Integration**: Provides translations for predefined text using i18next.
- **Google Translate API Integration**: Dynamically translates arbitrary text into a target language.
- **Language Detection**: Automatically detects the language of the provided text.

## Installation

1. **Clone the Repository**:

   \`\`\`bash
   git clone https://github.com/bharatsharma19/Global-Translate.git
   cd Global-Translate
   \`\`\`

2. **Install Dependencies**:

   \`\`\`bash
   npm install
   \`\`\`

3. **Set Up Environment Variables**:

   - Create a \`.env\` file in the root directory of the project and add your Google Cloud API key:

     \`\`\`plaintext
     GOOGLE_TRANSLATE_API_KEY=your-google-api-key
     \`\`\`

4. **Generate Google API Key**:
   - To use the Google Translate API, you need to generate an API key:
     1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
     2. Create a new project or select an existing one.
     3. Navigate to the **API & Services** section.
     4. Enable the **Google Cloud Translation API**.
     5. Go to the **Credentials** section.
     6. Create an API key and copy it.
     7. Replace \`your-google-api-key\` in the \`.env\` file with your actual Google Cloud API key.

## Usage

### Google Translate API Endpoint

Translate text dynamically to Japanese or other target languages:

- **Endpoint**: \`/convert-google/:text\`
- **Method**: \`GET\`
- **Parameters**:
  - \`text\`: The text you want to translate.

#### Example Request:

\`\`\`bash
curl http://localhost:3000/convert-google/Japanese/hello%20world
\`\`\`

#### Example Response:

\`\`\`json
{
  "success": true,
  "originalText": "hello world",
  "detectedLanguage": {
    "code": "en",
    "name": "English"
  },
  "targetLanguage": {
    "code": "ja",
    "name": "Japanese"
  },
  "translatedText": "こんにちは世界"
}
\`\`\`

### i18next Endpoint

Use predefined translations for specific keys:

- **Endpoint**: \`/convert-i18next/:text\`
- **Method**: \`GET\`
- **Parameters**:
  - \`text\`: The text you want to convert (must match predefined keys).

#### Example Request:

\`\`\`bash
curl http://localhost:3000/convert-i18next/Japanese/hello%20world
\`\`\`

#### Example Response:

\`\`\`json
{
  "success": true,
  "originalText": "hello world",
  "translatedText": "こんにちは世界"
}
\`\`\`

## Running the Application

Start the server on port 3000:

\`\`\`bash
npm start
\`\`\`

Navigate to \`http://localhost:3000\` to access the endpoints.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to submit issues, feature requests, or pull requests. For more information, check out the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## Contact

For questions or support, please contact [bharat8717sharma@gmail.com](mailto:bharat8717sharma@gmail.com).
