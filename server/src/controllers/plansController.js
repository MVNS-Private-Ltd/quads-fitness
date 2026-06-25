import prisma from '../prisma.js';

const log = async (action, details, entity = null, entityId = null) => {
  try { await prisma.activityLog.create({ data: { action, details, entity, entityId } }); } catch (e) { }
};

export const getPlans = async (req, res) => {
  try {
    const where = req.query.all === 'true' ? {} : { status: 'Active' };
    const plans = await prisma.plan.findMany({ where, orderBy: { price: 'asc' } });
    const parsed = plans.map(p => {
      let parsedFeatures = [];
      try {
        parsedFeatures = JSON.parse(p.features || '[]');
      } catch (e) {
        console.error(`Failed to parse features for plan ${p.id}:`, e);
      }
      return { ...p, features: parsedFeatures };
    });
    res.json(parsed);
  } catch (error) {
    console.error('Error in getPlans:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getPlan = async (req, res) => {
  const plan = await prisma.plan.findUnique({ where: { id: Number(req.params.id) } });
  if (!plan) return res.status(404).json({ error: 'Not found' });
  res.json({ ...plan, features: JSON.parse(plan.features || '[]') });
};

export const createPlan = async (req, res) => {
  try {
    const { name, price, billing, description, features, status, featured } = req.body;
    if (!name || price === undefined) return res.status(400).json({ error: 'Name and price are required' });
    
    // If features is already a string (from frontend stringify), parse it first so we don't double stringify
    let parsedFeatures = features;
    if (typeof features === 'string') {
      try { parsedFeatures = JSON.parse(features); } catch (e) { parsedFeatures = []; }
    }
    
    const plan = await prisma.plan.create({
      data: { name, price: Number(price), billing, description, features: JSON.stringify(parsedFeatures || []), status, featured: !!featured },
    });
    await log('Created Plan', `"${name}" plan added`, 'Plan', plan.id);
    res.status(201).json({ ...plan, features: JSON.parse(plan.features) });
  } catch (error) {
    console.error('Error in createPlan:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const { name, price, billing, description, features, status, featured } = req.body;
    
    let parsedFeatures = features;
    if (typeof features === 'string') {
      try { parsedFeatures = JSON.parse(features); } catch (e) { parsedFeatures = []; }
    }

    const plan = await prisma.plan.update({
      where: { id: Number(req.params.id) },
      data: { name, price: Number(price), billing, description, features: JSON.stringify(parsedFeatures || []), status, featured: !!featured },
    });
    await log('Updated Plan', `"${name}" updated`, 'Plan', plan.id);
    res.json({ ...plan, features: JSON.parse(plan.features) });
  } catch (error) {
    console.error('Error in updatePlan:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const plan = await prisma.plan.findUnique({ where: { id: Number(req.params.id) } });
    if (!plan) return res.status(404).json({ error: 'Not found' });
    await prisma.plan.delete({ where: { id: Number(req.params.id) } });
    await log('Deleted Plan', `"${plan.name}" removed`, 'Plan', plan.id);
    res.json({ message: 'Plan deleted' });
  } catch (error) {
    console.error('Error in deletePlan:', error);
    res.status(500).json({ error: error.message });
  }
};
