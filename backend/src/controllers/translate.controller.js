const axios = require('axios');

class TranslateController {
  async translate(req, res) {
    try {
      const { text, target = 'en' } = req.body;

      if (!text) {
        return res.status(400).json({
          error: 'El texto es obligatorio',
        });
      }

      const response = await axios.get(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${target}`
      );

      return res.status(200).json({
        original: text,
        translated: response.data.responseData.translatedText,
        target,
      });
    } catch (error) {
      console.error('Error traduccion:', error.message);

      return res.status(200).json({
        original: req.body.text,
        translated: null,
        message:
          'Servicio de traducción temporalmente no disponible. La aplicación sigue funcionando correctamente.',
      });
    }
  }
}

module.exports = new TranslateController();