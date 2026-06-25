import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMyReview, submitReview, getCachedReview } from '../../services/memberApi';

export default function MemberReviewPage() {
  const [review, setReview] = useState(getCachedReview() || null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(!getCachedReview());
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchReview();
  }, []);

  const fetchReview = async () => {
    try {
      const data = await getMyReview();
      if (data) {
        setReview(data);
        setRating(data.rating);
        setComment(data.comment);
      }
    } catch (err) {
      console.error('Failed to load review', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    try {
      const updated = await submitReview({ rating, comment });
      setReview(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-display text-white mb-2">Rate Your Experience</h2>
        <p className="text-brand-muted font-body">Let us know how we're doing. Your review helps us improve and inspire others.</p>
      </div>

      <div className="bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        {loading ? (
          <div className="text-center text-brand-muted py-8">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {review && (
              <div className="bg-brand-dark p-4 rounded-xl border border-white/5 mb-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-brand-muted">Current Status</p>
                  <p className={`font-medium ${review.status === 'Approved' ? 'text-green-500' : review.status === 'Rejected' ? 'text-red-500' : 'text-brand-gold'}`}>
                    {review.status}
                  </p>
                </div>
                {review.status === 'Approved' && (
                  <span className="text-xs bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20">
                    Live on Homepage
                  </span>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-brand-muted mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-2 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <svg
                      stroke="currentColor"
                      fill={rating >= star ? "currentColor" : "none"}
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      className={`w-8 h-8 ${rating >= star ? 'text-brand-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'text-white/20'}`}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-muted mb-2">Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your transformation story, what you love about the gym, etc."
                className="w-full bg-brand-dark border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-brand-gold focus:outline-none transition-colors min-h-[120px]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-aggressive bg-brand-gold text-brand-darker font-bold py-4 rounded-xl hover:bg-white disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Submitting...' : review ? 'Update Review' : 'Submit Review'}
            </button>

            {success && (
              <p className="text-green-500 text-center text-sm mt-4">Review submitted successfully! It is now pending admin approval.</p>
            )}
            
          </form>
        )}
      </div>
    </motion.div>
  );
}
