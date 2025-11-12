// middlewares/validation.js
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().max(255).required(),
  message: Joi.string().min(1).max(5000).required(),
});

exports.validateContact = (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};
