import { Router } from 'express';
import { createResponse } from '../controllers/responsesController.js';

const router = Router();

router.post('/', createResponse);

// routes/responses.js
router.get('/campaign/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase.rpc(
    'get_campaign_stats',
    { p_campaign_id: id }
  );

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});


export default router;
