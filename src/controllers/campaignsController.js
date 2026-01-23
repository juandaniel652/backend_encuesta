import * as CampaignService from '../services/campaignsService.js';

export async function getCampaigns(req, res, next) {
  try {
    const campaigns = await CampaignService.getCampaigns();
    res.json(campaigns);
  } catch (err) {
    next(err);
  }
}


export async function createCampaign(req, res, next) {
  try {
    const campaign = await CampaignService.createCampaign(req.body);
    res.status(201).json(campaign);
  } catch (err) {
    next(err);
  }
}

