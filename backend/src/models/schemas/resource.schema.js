const Joi = require('joi');
const objectId = require('../../routes/validations/objectId.validator');

const resourceSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),

  description: Joi.string().max(500).allow('').optional(),

  stock: Joi.number().integer().min(0).required(),

  category: objectId().required(),

  status: Joi.string()
    .valid('available', 'maintenance', 'inactive')
    .default('available'),
});

module.exports = resourceSchema;
