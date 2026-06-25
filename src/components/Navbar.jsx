import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSettings } from '../contexts/SettingsContext'
import { motion, AnimatePresence } from 'framer-motion'
import BrandLogo from './BrandLogo'

// Updated to map names to actual URL routes
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Programs', path: '/programs' },
  { name: 'Trainers', path: '/trainers' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' }
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { settings } = useSettings()
  const location = useLocation()
  const cleanPhone = settings?.phone?.replace(/\D/g, '')
  const whatsappHref = cleanPhone ? `https://wa.me/${cleanPhone}` : null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-brand-gold/10 py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo - Upgraded to React Router Link */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative shrink-0">
            <BrandLogo
              settings={settings}
              className="h-10 w-10 object-cover object-top group-hover:scale-105 transition-transform duration-300"
              alt="Quads Fitness Gym Logo - Manimajra"
            />
            <div className="absolute -inset-2 bg-brand-orange/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 rounded-full"></div>
          </div>
          <span className="font-display text-2xl text-white tracking-wider">
            {settings?.gymName ? settings.gymName.split(' ')[0].toUpperCase() : 'QUADS'} <span className="text-brand-orange group-hover:text-brand-gold transition-colors duration-300">{settings?.gymName ? settings.gymName.split(' ').slice(1).join(' ').toUpperCase() : 'FITNESS'}</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 relative">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            
            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`relative text-sm font-heading font-medium tracking-wide uppercase transition-colors duration-300 py-2 ${
                    isActive ? 'text-brand-gold' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.name}
                  {/* Premium Animated Underline for Active Route */}
                  {isActive && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute left-0 right-0 -bottom-1 h-[2px] bg-brand-gold"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/member/login"
            className="text-sm font-heading font-medium tracking-wide uppercase text-white/70 hover:text-white transition-colors duration-300"
          >
            Member Login
          </Link>
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark text-sm font-bold uppercase tracking-widest px-6 py-2.5 rounded-sm transition-all duration-300 hover:shadow-glow-gold hover:-translate-y-0.5"
            >
              Join Now
            </a>
          )}
        </div>

        {/* Mobile Hamburger (Kept your custom animated icon!) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white p-2 relative z-50"
          aria-label="Toggle menu"
        >
          <div className={`w-6 h-0.5 bg-brand-gold mb-1.5 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-6 h-0.5 bg-brand-gold mb-1.5 transition-all ${open ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-0.5 bg-brand-gold transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: '100vh', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 w-full glass-panel border-t border-brand-gold/10 overflow-hidden"
          >
            <ul className="px-6 flex flex-col items-center justify-center h-[80vh] gap-8">
              {navLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className={`block font-heading text-2xl tracking-widest uppercase transition-colors duration-200 ${
                        isActive ? 'text-brand-gold' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                )
              })}
              <li className="mt-4">
                <Link
                  to="/member/login"
                  className="block font-heading text-xl tracking-widest uppercase text-brand-gold/80 hover:text-brand-gold transition-colors duration-200 text-center"
                >
                  Member Login
                </Link>
              </li>
              {whatsappHref && (
              <li className="mt-2">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-r from-brand-orange to-brand-gold text-brand-dark text-center font-bold uppercase tracking-widest px-8 py-3 rounded-sm shadow-glow-gold"
                >
                  Join Now
                </a>
              </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
