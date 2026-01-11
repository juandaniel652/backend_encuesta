import { saveResponse } from '../services/responsesService.js';

export const createResponse = async (req, res, next) => {
  try {
    const { campaignId, clientNumber, clientName, answers } = req.body;

    if (!campaignId || !answers?.length) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    await saveResponse({ campaignId, clientNumber, clientName, answers });

    res.status(201).json({ message: 'Respuesta guardada correctamente' });
  } catch (err) {
    next(err);
  }
};
