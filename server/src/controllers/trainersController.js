import prisma from '../prisma.js';
import { uploadToSupabase } from '../lib/uploadToSupabase.js';

const log = async (action, details, entity = null, entityId = null) => {
  try { await prisma.activityLog.create({ data: { action, details, entity, entityId } }); } catch (e) {}
};

export const getTrainers = async (req, res) => {
  const where = req.query.all === 'true' ? {} : { status: 'Active' };
  const trainers = await prisma.trainer.findMany({ where, orderBy: { featured: 'desc' } });
  res.json(trainers);
};

export const getTrainer = async (req, res) => {
  const trainer = await prisma.trainer.findUnique({ where: { id: Number(req.params.id) } });
  if (!trainer) return res.status(404).json({ error: 'Not found' });
  res.json(trainer);
};

export const createTrainer = async (req, res) => {
  const { name, specialty, bio, instagram, status, featured } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const imageUrl = req.file ? await uploadToSupabase(req.file) : null;
  const trainer = await prisma.trainer.create({ data: { name, specialty, bio, imageUrl, instagram, status, featured: featured === true || featured === 'true' } });
  await log('Added Trainer', `${name} joined the team`, 'Trainer', trainer.id);
  res.status(201).json(trainer);
};

export const updateTrainer = async (req, res) => {
  const { name, specialty, bio, instagram, status, featured } = req.body;
  const imageUrl = req.file ? await uploadToSupabase(req.file) : undefined;
  const data = { name, specialty, bio, instagram, status, featured: featured === true || featured === 'true' };
  if (imageUrl) data.imageUrl = imageUrl;
  const trainer = await prisma.trainer.update({ where: { id: Number(req.params.id) }, data });
  await log('Updated Trainer', `${name} profile updated`, 'Trainer', trainer.id);
  res.json(trainer);
};

export const deleteTrainer = async (req, res) => {
  const trainer = await prisma.trainer.findUnique({ where: { id: Number(req.params.id) } });
  if (!trainer) return res.status(404).json({ error: 'Not found' });
  await prisma.trainer.delete({ where: { id: Number(req.params.id) } });
  await log('Deleted Trainer', `${trainer.name} removed`, 'Trainer', trainer.id);
  res.json({ message: 'Trainer deleted' });
};
