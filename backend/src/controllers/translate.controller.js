const axios = require('axios');

const MAX_CACHE = 500;
// Caché en memoria: evita gastar cuota de MyMemory repitiendo el mismo texto.
// En Vercel dura lo que viva la instancia, por eso el frontend también guarda las traducciones.
const cache = new Map();

function guardarEnCache(clave, traduccion) {
  if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value);
  cache.set(clave, traduccion);
}

class TranslateController {
  async translate(req, res) {
    const { text, target = 'en' } = req.body;
    const noDisponible = {
      original: text,
      translated: null,
      target,
      message:
        'Servicio de traducción temporalmente no disponible. La aplicación sigue funcionando correctamente.',
    };

    const clave = `${target}:${text}`;
    if (cache.has(clave)) {
      return res.status(200).json({ original: text, translated: cache.get(clave), target });
    }

    try {
      const { data } = await axios.get('https://api.mymemory.translated.net/get', {
        params: { q: text, langpair: `es|${target}` },
        timeout: 5000,
      });

      const translated = data.responseData?.translatedText;
      // Sin cuota, MyMemory responde 200 con un aviso en el lugar de la traducción.
      const exitosa =
        Number(data.responseStatus) === 200 && translated && !data.quotaFinished && !/MYMEMORY WARNING/i.test(translated);

      if (!exitosa) {
        return res.status(200).json(noDisponible);
      }

      guardarEnCache(clave, translated);
      return res.status(200).json({ original: text, translated, target });
    } catch (error) {
      console.error('Error traduccion:', error.message);
      return res.status(200).json(noDisponible);
    }
  }
}

module.exports = new TranslateController();
