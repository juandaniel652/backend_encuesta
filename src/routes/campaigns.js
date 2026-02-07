import { Router } from 'express';
import { pool } from '../config/db.js';
import {
  getCampaigns,
  getCampaignById,
  createCampaign
} from '../controllers/campaignsController.js';



const router = Router();

router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.post('/', createCampaign);

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, client_type, date_start, date_end } = req.body;

    const result = await pool.query(
      `UPDATE campaigns 
       SET name = $1, client_type = $2, date_start = $3, date_end = $4
       WHERE id = $5
       RETURNING *`,
      [name, client_type, date_start, date_end, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('UPDATE CAMPAIGN ERROR:', err);
    res.status(500).json({ error: 'Error updating campaign' });
  }
});

export default router;
