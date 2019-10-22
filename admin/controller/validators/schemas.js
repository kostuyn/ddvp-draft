const Joi = require('@hapi/joi');

const DEFAULT_HOST = 'localhost';

exports.postRunSchema = Joi.object({
    port: Joi.number().min(0).max(65535).required(),
    host: Joi.string().default(DEFAULT_HOST).optional()
});

exports.delRunSchema = Joi.object({
    port: Joi.number().min(0).max(65535).required(),
    host: Joi.string().default(DEFAULT_HOST).optional()
});
