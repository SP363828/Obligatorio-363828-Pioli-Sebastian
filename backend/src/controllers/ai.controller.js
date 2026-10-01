const { GoogleGenerativeAI } = require('@google/generative-ai');

const { findResources } = require('../repositories/resource.repository');

class AiController {
  async recommendResource(req, res) {
    try {
      const { description } = req.body;
      if (!description) {
        return res.status(400).json({
          error: 'La descripción es obligatoria',
        });
      }
      const resources = await findResources({ status: 'available' }, {});
      if (!resources || resources.length === 0) {
        return res.status(404).json({
          error: 'No hay recursos disponibles',
        });
      }
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
      const resourcesText = resources
        .map(
          (resource, index) => `${index + 1}.Nombre: ${resource.name}
          Descripción: ${resource.description || 'Sin descripción'}
          Categoría: ${
            resource.category?.name || resource.category || 'Sin categoría'
          }
          Estado: ${resource.status || 'available'}`
        )
        .join('\n');
      const prompt = `Eres un asistente de un sistema de reservas de recursos.
Necesidad del usuario:
"${description}"

Recursos disponibles:
${resourcesText}

Debes elegir UN SOLO recurso.

Responde EXCLUSIVAMENTE en JSON válido con este formato:

{
  "recommendation": "nombre exacto del recurso",
  "reason": "explicación breve"
}
`;

      const result = await model.generateContent(prompt);

      const text = result.response
        .text()
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const recommendation = JSON.parse(text);

      return res.status(200).json(recommendation);
    } catch (error) {
      console.error('Error IA:', error.message);

      return res.status(200).json({
        recommendation: null,
        message:
          'Servicio de IA temporalmente no disponible. La aplicación sigue funcionando correctamente.',
      });
    }
  }
}

module.exports = new AiController();