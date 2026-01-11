const { z } = require('zod');

exports.registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
