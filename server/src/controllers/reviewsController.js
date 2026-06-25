import prisma from '../prisma.js';

// GET /api/reviews
// Public: Get all approved reviews
export const getPublicReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: 'Approved' },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/admin/reviews
// Admin: Get all reviews
export const getAdminReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        member: { select: { email: true, profilePhoto: true } }
      }
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/admin/reviews/:id
// Admin: Update review status
export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const review = await prisma.review.update({
      where: { id: Number(req.params.id) },
      data: { status }
    });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/admin/reviews/:id
// Admin: Delete review
export const deleteReview = async (req, res) => {
  try {
    await prisma.review.delete({
      where: { id: Number(req.params.id) }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
