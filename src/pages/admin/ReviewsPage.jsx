import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAdminReviews, updateReviewStatus, deleteReview } from '../../services/api';
import { FiCheck, FiX, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { StatusChip } from '../../components/admin/SharedAdminUI';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getAdminReviews();
      setReviews(data);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this review as ${status}?`)) return;
    try {
      await updateReviewStatus(id, status);
      fetchReviews();
    } catch (err) {
      alert(err.message || 'Failed to update review status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    try {
      await deleteReview(id);
      fetchReviews();
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-display text-white mb-2">Member Reviews</h2>
          <p className="text-brand-muted font-body">Manage member ratings and comments for the public homepage.</p>
        </div>
      </div>

      <div className="bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        {loading ? (
          <div className="text-center py-12 text-brand-muted">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-brand-muted">
            <FiMessageSquare className="mx-auto text-4xl mb-4 text-brand-gold/50" />
            <p>No reviews have been submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Member</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Rating</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Comment</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Status</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm">Date</th>
                  <th className="py-3 px-4 text-brand-muted font-body text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => (
                  <tr key={review.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold overflow-hidden">
                          {review.member?.profilePhoto ? (
                            <img src={review.member.profilePhoto} alt={review.memberName} className="w-full h-full object-cover" />
                          ) : (
                            review.memberName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{review.memberName}</p>
                          <p className="text-xs text-brand-muted">{review.member?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex text-brand-gold text-sm">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-brand-gold" : "text-white/20"} />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-brand-platinum text-sm max-w-xs truncate">
                      {review.comment}
                    </td>
                    <td className="py-4 px-4">
                      <StatusChip status={review.status} />
                    </td>
                    <td className="py-4 px-4 text-brand-muted text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {review.status !== 'Approved' && (
                          <button
                            onClick={() => handleUpdateStatus(review.id, 'Approved')}
                            className="p-2 text-brand-muted hover:text-green-500 bg-brand-dark rounded-lg border border-white/5 hover:border-green-500/30 transition-colors"
                            title="Approve"
                          >
                            <FiCheck size={16} />
                          </button>
                        )}
                        {review.status !== 'Rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(review.id, 'Rejected')}
                            className="p-2 text-brand-muted hover:text-orange-500 bg-brand-dark rounded-lg border border-white/5 hover:border-orange-500/30 transition-colors"
                            title="Reject"
                          >
                            <FiX size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-brand-muted hover:text-red-500 bg-brand-dark rounded-lg border border-white/5 hover:border-red-500/30 transition-colors"
                          title="Delete permanently"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Needed icon import fallback
function FiStar(props) {
  return <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
}
