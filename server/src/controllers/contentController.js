import prisma from '../prisma.js';
import { uploadToSupabase } from '../lib/uploadToSupabase.js';

const log = async (action, details, entity = null, entityId = null) => {
  try { await prisma.activityLog.create({ data: { action, details, entity, entityId } }); } catch (e) {}
};

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
export const getTestimonials = async (req, res) => {
  const where = req.query.all === 'true' ? {} : { status: 'Published' };
  const testimonials = await prisma.testimonial.findMany({ where, orderBy: { featured: 'desc' } });
  res.json(testimonials);
};

export const createTestimonial = async (req, res) => {
  const { clientName, transformation, quote, rating, status, featured } = req.body;
  if (!clientName || !quote) return res.status(400).json({ error: 'Client name and quote required' });
  const imageUrl = req.file ? await uploadToSupabase(req.file) : null;
  const item = await prisma.testimonial.create({ data: { clientName, transformation, quote, imageUrl, rating: Number(rating) || 5, status, featured: featured === true || featured === 'true' } });
  await log('Added Testimonial', `${clientName} testimonial added`, 'Testimonial', item.id);
  res.status(201).json(item);
};

export const updateTestimonial = async (req, res) => {
  const { clientName, transformation, quote, rating, status, featured } = req.body;
  const imageUrl = req.file ? await uploadToSupabase(req.file) : undefined;
  const data = { clientName, transformation, quote, rating: Number(rating) || 5, status, featured: featured === true || featured === 'true' };
  if (imageUrl) data.imageUrl = imageUrl;
  const item = await prisma.testimonial.update({ where: { id: Number(req.params.id) }, data });
  await log('Updated Testimonial', `${clientName} testimonial updated`, 'Testimonial', item.id);
  res.json(item);
};

export const deleteTestimonial = async (req, res) => {
  await prisma.testimonial.delete({ where: { id: Number(req.params.id) } });
  await log('Deleted Testimonial', 'Testimonial removed', 'Testimonial', Number(req.params.id));
  res.json({ message: 'Deleted' });
};

// ─── GALLERY ─────────────────────────────────────────────────────────────────
export const getGallery = async (req, res) => {
  const where = req.query.all === 'true' ? {} : { status: 'Published' };
  if (req.query.category) where.category = req.query.category;
  const items = await prisma.gallery.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(items);
};

export const createGalleryItem = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file is required' });
    const { title, category, status, featured } = req.body;
    const imageUrl = await uploadToSupabase(req.file);
    if (!imageUrl) return res.status(500).json({ error: 'Image upload to storage failed — no URL returned' });
    const item = await prisma.gallery.create({ data: { title: title || req.file.originalname, imageUrl, category: category || 'Gym', status: status || 'Published', featured: !!featured } });
    await log('Uploaded Image', `"${item.title}" added to gallery`, 'Gallery', item.id);
    res.status(201).json(item);
  } catch (err) {
    console.error('[Gallery Upload Error]', err);
    res.status(500).json({ error: err.message || 'Failed to upload image' });
  }
};

export const updateGalleryItem = async (req, res) => {
  const { title, category, status, featured } = req.body;
  const item = await prisma.gallery.update({ where: { id: Number(req.params.id) }, data: { title, category, status, featured: !!featured } });
  res.json(item);
};

export const deleteGalleryItem = async (req, res) => {
  await prisma.gallery.delete({ where: { id: Number(req.params.id) } });
  await log('Deleted Image', 'Gallery image removed', 'Gallery', Number(req.params.id));
  res.json({ message: 'Deleted' });
};

// ─── OFFERS ──────────────────────────────────────────────────────────────────
export const getOffers = async (req, res) => {
  const where = req.query.all === 'true' ? {} : { status: 'Active' };
  const items = await prisma.offer.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(items);
};

export const createOffer = async (req, res) => {
  const { title, description, badgeText, validUntil, status, featured } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const item = await prisma.offer.create({ data: { title, description, badgeText, validUntil: validUntil ? new Date(validUntil) : null, status, featured: !!featured } });
  await log('Created Offer', `"${title}" published`, 'Offer', item.id);
  res.status(201).json(item);
};

export const updateOffer = async (req, res) => {
  const { title, description, badgeText, validUntil, status, featured } = req.body;
  const item = await prisma.offer.update({ where: { id: Number(req.params.id) }, data: { title, description, badgeText, validUntil: validUntil ? new Date(validUntil) : null, status, featured: !!featured } });
  await log('Updated Offer', `"${title}" updated`, 'Offer', item.id);
  res.json(item);
};

export const deleteOffer = async (req, res) => {
  await prisma.offer.delete({ where: { id: Number(req.params.id) } });
  await log('Deleted Offer', 'Offer removed', 'Offer', Number(req.params.id));
  res.json({ message: 'Deleted' });
};
