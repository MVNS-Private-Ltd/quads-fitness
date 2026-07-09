import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { useSettings } from '../contexts/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  const address = settings?.address?.trim();

  return (
    <footer className="bg-brand-darker border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <BrandLogo settings={settings} className="h-10 w-auto" alt="Quads Fitness Gym Logo Manimajra" />
            <div>
              <span className="font-display text-xl text-white tracking-wider block">{settings?.gymName ? settings.gymName.split(' ')[0].toUpperCase() : 'QUADS'} <span className="text-brand-orange">{settings?.gymName ? settings.gymName.split(' ').slice(1).join(' ').toUpperCase() : 'FITNESS'}</span></span>
            </div>
          </div>
          <p className="text-white/40 text-xs font-body leading-relaxed mb-4">
            Manimajra's premier fitness destination for serious results. State-of-the-art equipment, certified trainers, and no excuses.
          </p>
          {address && <span className="text-white/30 text-[10px] font-accent tracking-widest uppercase">{address}</span>}
        </div>
        
        <div>
          <h3 className="text-xs font-accent uppercase tracking-widest text-brand-gold mb-4">Quick Links</h3>
          <div className="flex flex-col gap-2 text-white/40 text-sm">
            <Link to="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <Link to="/about" className="hover:text-brand-orange transition-colors">About Us</Link>
            <Link to="/programs" className="hover:text-brand-orange transition-colors">Membership Plans</Link>
            <Link to="/trainers" className="hover:text-brand-orange transition-colors">Our Trainers</Link>
            <Link to="/blog" className="hover:text-brand-orange transition-colors">Fitness Blog</Link>
            <Link to="/contact" className="hover:text-brand-orange transition-colors">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-accent uppercase tracking-widest text-brand-gold mb-4">Specialised Training</h3>
          <div className="flex flex-col gap-2 text-white/40 text-sm">
            <Link to="/personal-training-manimajra" className="hover:text-brand-orange transition-colors">Personal Training in Manimajra</Link>
            <Link to="/weight-loss-gym-manimajra" className="hover:text-brand-orange transition-colors">Weight Loss Programmes</Link>
            <Link to="/gym-membership-manimajra" className="hover:text-brand-orange transition-colors">Compare Gym Memberships</Link>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-accent uppercase tracking-widest text-brand-gold mb-4">Opening Hours</h3>
          <div className="flex flex-col gap-2 text-white/40 text-sm">
            {settings?.mondayHours && <p><strong>Mon-Fri:</strong> {settings.mondayHours}</p>}
            {settings?.saturdayHours && <p><strong>Saturday:</strong> {settings.saturdayHours}</p>}
            {settings?.sundayHours && <p><strong>Sunday:</strong> {settings.sundayHours}</p>}
            <p className="mt-2 text-xs text-white/30">Open 7 Days a Week</p>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-accent uppercase tracking-widest text-brand-gold mb-4">Legal</h3>
          <div className="flex flex-col gap-2 text-white/40 text-sm">
            <Link to="/terms" className="hover:text-brand-orange transition-colors">Terms & Conditions</Link>
            <Link to="/privacy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} {settings?.gymName || 'Quads Fitness Gym'}. All rights reserved.</p>
      </div>
    </footer>
  )
}
