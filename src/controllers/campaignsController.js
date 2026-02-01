import * as CampaignService from '../services/campaignsService.js';


export async function getCampaigns(req, res, next) {
  try {
    const campaigns = await CampaignService.getCampaigns();
    res.json(campaigns);
  } catch (err) {
    next(err);
  }
}


export const createCampaign = async (req, res) => {

  console.log('🔥 BODY RECIBIDO:', req.body);

  const { name, client_type, date_start, date_end } = req.body;

  if (!name || !client_type) {
    return res.status(400).json({ error: "Invalid campaign data" });
  }

  const { data, error } = await supabase
    .from('campaigns')
    .insert([{
      name,
      client_type,
      date_start,
      date_end
    }])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};
