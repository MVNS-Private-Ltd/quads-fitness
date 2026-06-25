import { useState, useEffect } from 'react';
import { getMe, updateMe, getCachedMe } from '../../services/memberApi';
import { User, Save, Upload, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MemberProfilePage() {
  const [member, setMember] = useState(getCachedMe() || null);
  const [loading, setLoading] = useState(!getCachedMe());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    phone: getCachedMe()?.phone || '',
    age: getCachedMe()?.age || '',
    gender: getCachedMe()?.gender || '',
    emergencyContact: getCachedMe()?.emergencyContact || '',
    healthNotes: getCachedMe()?.healthNotes || '',
    fitnessGoals: getCachedMe()?.fitnessGoals || ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getMe();
      setMember(data);
      setFormData({
        phone: data.phone || '',
        age: data.age || '',
        gender: data.gender || '',
        emergencyContact: data.emergencyContact || '',
        healthNotes: data.healthNotes || '',
        fitnessGoals: data.fitnessGoals || ''
      });
    } catch (err) {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let dataToSend;
      if (imageFile) {
        dataToSend = new FormData();
        Object.keys(formData).forEach(key => dataToSend.append(key, formData[key] || ''));
        dataToSend.append('profilePhoto', imageFile);
      } else {
        dataToSend = formData;
      }

      const updated = await updateMe(dataToSend);
      setMember(updated);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="text-brand-gold animate-pulse text-lg">Loading profile...</div>;
  if (error && !member) return <div className="bg-brand-red/10 text-brand-red p-4 rounded-lg border border-brand-red/30 max-w-5xl mx-auto mt-8">{error}</div>;
  if (!member) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">My Profile</h1>
          <p className="text-brand-gray">Manage your personal information.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-brand-darker border border-brand-gold text-brand-gold px-4 py-2 rounded-lg flex items-center hover:bg-brand-gold hover:text-brand-darker transition-colors font-medium"
          >
            <Edit2 size={18} className="mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      {error && <div className="bg-brand-red/10 text-brand-red p-4 rounded-lg border border-brand-red/30">{error}</div>}
      {success && <div className="bg-green-500/10 text-green-400 p-4 rounded-lg border border-green-500/30">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Read-Only Info & Avatar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-brand-dark border border-brand-gray/10 rounded-xl p-6 text-center">
            <div className="w-32 h-32 mx-auto bg-brand-darker rounded-full flex items-center justify-center border-2 border-brand-gold mb-4 overflow-hidden relative">
              {previewUrl || member.profilePhoto ? (
                <img src={previewUrl || member.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-brand-gold" />
              )}
            </div>
            {isEditing && (
              <div className="mt-4">
                <input
                  type="file"
                  id="profilePhotoUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                />
                <label htmlFor="profilePhotoUpload" className="text-brand-gold text-sm flex items-center justify-center w-full hover:text-white transition-colors cursor-pointer">
                  <Upload size={16} className="mr-2" /> Change Photo
                </label>
              </div>
            )}
            <h2 className="text-xl font-bold text-white mt-4">{member.name}</h2>
            <p className="text-brand-gray">{member.email}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full text-xs uppercase tracking-wider font-bold">
              {member.status} Member
            </span>
          </div>

          <div className="bg-brand-dark border border-brand-gray/10 rounded-xl p-6">
            <h3 className="font-heading text-lg text-white mb-4 border-b border-brand-gray/10 pb-2">Assigned Trainer</h3>
            {member.trainer ? (
              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand-darker rounded-full overflow-hidden mr-4 border border-brand-gold/30 flex items-center justify-center">
                  {member.trainer.imageUrl ? (
                    <img src={member.trainer.imageUrl} alt={member.trainer.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-brand-gray" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{member.trainer.name}</p>
                  <p className="text-brand-gray text-sm">{member.trainer.specialty || 'General Training'}</p>
                </div>
              </div>
            ) : (
              <p className="text-brand-gray text-sm">No trainer assigned currently.</p>
            )}
          </div>
        </div>

        {/* Right Column: Editable Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-brand-dark border border-brand-gray/10 rounded-xl p-6 md:p-8">
            <h3 className="font-heading text-xl text-white mb-6">Personal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-brand-gray mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-brand-darker border border-brand-gray/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-gold disabled:opacity-70"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-brand-darker border border-brand-gray/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-gold disabled:opacity-70"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-brand-darker border border-brand-gray/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-gold disabled:opacity-70"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray mb-2">Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-brand-darker border border-brand-gray/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-gold disabled:opacity-70"
                  placeholder="Name - Phone"
                />
              </div>
            </div>

            <h3 className="font-heading text-xl text-white mb-6">Health & Goals</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-brand-gray mb-2">Health Notes / Medical Conditions</label>
                <textarea
                  name="healthNotes"
                  value={formData.healthNotes}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="3"
                  className="w-full bg-brand-darker border border-brand-gray/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-gold disabled:opacity-70"
                  placeholder="Any injuries or medical conditions the trainer should know about?"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray mb-2">Fitness Goals</label>
                <textarea
                  name="fitnessGoals"
                  value={formData.fitnessGoals}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="3"
                  className="w-full bg-brand-darker border border-brand-gray/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-gold disabled:opacity-70"
                  placeholder="What are you trying to achieve?"
                ></textarea>
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset to original data
                    setImageFile(null);
                    setPreviewUrl(null);
                    setFormData({
                      phone: member.phone || '',
                      age: member.age || '',
                      gender: member.gender || '',
                      emergencyContact: member.emergencyContact || '',
                      healthNotes: member.healthNotes || '',
                      fitnessGoals: member.fitnessGoals || ''
                    });
                  }}
                  className="px-6 py-3 text-brand-gray hover:text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-gold text-brand-darker px-8 py-3 rounded-lg font-bold hover:bg-brand-gold/90 transition-colors flex items-center"
                >
                  {saving ? 'Saving...' : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
