import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { StatusChip, EmptyState, TableFilterBar, PreviewDrawer } from '../../components/admin/SharedAdminUI';
import { FiImage, FiUploadCloud, FiTrash2 } from 'react-icons/fi';
import { getGallery, createGalleryItem, deleteGalleryItem } from '../../services/api';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }
};

export default function GalleryPage() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', file.name);
      formData.append('category', 'Gym');

      const newItem = await createGalleryItem(formData);
      setMediaItems([newItem, ...mediaItems]);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!selectedMedia) return;
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await deleteGalleryItem(selectedMedia.id);
      setMediaItems(mediaItems.filter(m => m.id !== selectedMedia.id));
      setSelectedMedia(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete media.');
    }
  };

  useEffect(() => {
    getGallery().then(data => {
      setMediaItems(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-display text-white mb-2">Media Gallery</h2>
          <p className="text-brand-muted font-body">Manage images and videos used across the website.</p>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*,video/*" 
          className="hidden" 
        />
        <button 
          onClick={handleUploadClick}
          disabled={uploading}
          className="px-6 py-3 bg-brand-gold text-brand-darker font-heading font-bold rounded-xl hover:bg-white transition-colors shadow-glow-gold flex items-center gap-2 disabled:opacity-50"
        >
          <FiUploadCloud size={18} /> {uploading ? 'Uploading...' : 'Upload Media'}
        </button>
      </div>

      <div className="bg-brand-surface2 border border-white/5 rounded-2xl p-6">
        <TableFilterBar 
          filters={[{ label: 'Type', options: ['Images', 'Videos'] }, { label: 'Status', options: ['Published', 'Draft'] }]} 
        />

        {loading ? (
          <div className="text-brand-muted py-8 text-center">Loading gallery...</div>
        ) : mediaItems.length === 0 ? (
          <EmptyState 
            title="Gallery is Empty" 
            message="Upload photos of your gym to attract more members." 
            icon={FiImage}
            action={<button onClick={handleUploadClick} disabled={uploading} className="px-6 py-2 bg-brand-dark border border-white/10 text-white rounded-xl hover:border-brand-gold transition-colors disabled:opacity-50">{uploading ? 'Uploading...' : 'Upload Now'}</button>}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaItems.map((media, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={media.id}
                className="group relative aspect-square bg-brand-dark border border-white/5 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedMedia(media)}
              >
                {media.imageUrl ? (
                  <img src={media.imageUrl} alt={media.title || 'Media'} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiImage className="text-brand-muted/50 w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-white text-sm font-medium truncate">{media.title || 'Untitled'}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-brand-muted text-xs uppercase">{media.type || 'IMAGE'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <PreviewDrawer 
        isOpen={!!selectedMedia} 
        onClose={() => setSelectedMedia(null)} 
        title="Media Details"
      >
        {selectedMedia && (
          <div className="space-y-6">
            <div className="aspect-video bg-brand-dark rounded-xl border border-white/5 flex items-center justify-center mb-6 overflow-hidden">
               {selectedMedia.imageUrl ? (
                 <img src={selectedMedia.imageUrl} alt="Media preview" className="w-full h-full object-contain" />
               ) : (
                 <FiImage className="text-brand-muted/30 w-16 h-16" />
               )}
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs text-brand-muted uppercase tracking-wider block mb-1">File Name</span>
                <p className="text-white font-medium break-all">{selectedMedia.title || 'Untitled'}</p>
              </div>
              <div>
                <span className="text-xs text-brand-muted uppercase tracking-wider block mb-1">URL</span>
                <p className="text-brand-platinum text-xs break-all bg-brand-dark p-2 rounded">{selectedMedia.imageUrl || 'No URL'}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-xs text-brand-muted uppercase tracking-wider block mb-1">Type</span>
                  <p className="text-brand-platinum uppercase">{selectedMedia.type || 'IMAGE'}</p>
                </div>
                <div>
                  <span className="text-xs text-brand-muted uppercase tracking-wider block mb-1">Uploaded</span>
                  <p className="text-brand-platinum">{formatDate(selectedMedia.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex gap-3">
              <button 
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-500/10 text-red-500 border border-red-500/20 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <FiTrash2 size={16} /> Delete
              </button>
            </div>
          </div>
        )}
      </PreviewDrawer>
    </motion.div>
  );
}
