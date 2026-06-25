import prisma from '../prisma.js';

const log = async (action, details, entity = null, entityId = null) => {
  try { await prisma.activityLog.create({ data: { action, details, entity, entityId } }); } catch (e) {}
};

// GET /api/programs  (public gets only Active; admin gets all via ?all=true)
export const getPrograms = async (req, res) => {
  const where = req.query.all === 'true' ? {} : { status: 'Active' };
  const programs = await prisma.program.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(programs);
};

export const getProgram = async (req, res) => {
  const program = await prisma.program.findUnique({ where: { id: Number(req.params.id) } });
  if (!program) return res.status(404).json({ error: 'Not found' });
  res.json(program);
};

export const createProgram = async (req, res) => {
  const { title, description, instructor, duration, schedule, participants, imageUrl, status, featured } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const program = await prisma.program.create({ data: { title, description, instructor, duration, schedule, participants: Number(participants) || 0, imageUrl, status, featured: featured === true || featured === 'true' } });
  await log('Created Program', `"${title}" added`, 'Program', program.id);
  res.status(201).json(program);
};

export const updateProgram = async (req, res) => {
  const { title, description, instructor, duration, schedule, participants, imageUrl, status, featured } = req.body;
  const program = await prisma.program.update({
    where: { id: Number(req.params.id) },
    data: { title, description, instructor, duration, schedule, participants: Number(participants) || 0, imageUrl, status, featured: featured === true || featured === 'true' },
  });
  await log('Updated Program', `"${title}" updated`, 'Program', program.id);
  res.json(program);
};

export const deleteProgram = async (req, res) => {
  const program = await prisma.program.findUnique({ where: { id: Number(req.params.id) } });
  if (!program) return res.status(404).json({ error: 'Not found' });
  await prisma.program.delete({ where: { id: Number(req.params.id) } });
  await log('Deleted Program', `"${program.title}" deleted`, 'Program', program.id);
  res.json({ message: 'Program deleted' });
};
