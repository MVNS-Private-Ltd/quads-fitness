import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Shared Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import ScrollToTop from './components/ScrollToTop'
import AdminGuard from './components/admin/AdminGuard'

// Member Components
import MemberGuard from './components/member/MemberGuard'
import MemberLayout from './components/member/MemberLayout'

// Pages (lazy-loaded for code splitting)
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'))
const TrainersPage = lazy(() => import('./pages/TrainersPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))

// Blog Pages (lazy-loaded)
const BlogIndexPage = lazy(() => import('./pages/blog/BlogIndexPage'))
const Article1 = lazy(() => import('./pages/blog/Article1'))
const Article2 = lazy(() => import('./pages/blog/Article2'))
const Article3 = lazy(() => import('./pages/blog/Article3'))
const Article4 = lazy(() => import('./pages/blog/Article4'))
const Article5 = lazy(() => import('./pages/blog/Article5'))

// Landing Pages (lazy-loaded)
const PersonalTrainingManimajra = lazy(() => import('./pages/landing/PersonalTrainingManimajra'))
const GymMembershipManimajra = lazy(() => import('./pages/landing/GymMembershipManimajra'))
const WeightLossGymManimajra = lazy(() => import('./pages/landing/WeightLossGymManimajra'))

// Member Pages (lazy-loaded)
const MemberLoginPage = lazy(() => import('./pages/member/MemberLoginPage'))
const MemberDashboard = lazy(() => import('./pages/member/MemberDashboard'))
const MemberProfilePage = lazy(() => import('./pages/member/MemberProfilePage'))
const MemberProgressPage = lazy(() => import('./pages/member/MemberProgressPage'))
const MemberAttendancePage = lazy(() => import('./pages/member/MemberAttendancePage'))
const MemberMarkAttendancePage = lazy(() => import('./pages/member/MemberMarkAttendancePage'))
const MemberMembershipPage = lazy(() => import('./pages/member/MemberMembershipPage'))
const MemberDietPage = lazy(() => import('./pages/member/MemberDietPage'))
const MemberReviewPage = lazy(() => import('./pages/member/MemberReviewPage'))

// Additional UI & Pages
import CookieBanner from './components/CookieBanner'
import WhatsAppButton from './components/WhatsAppButton'
import PWAUpdatePrompt from './components/member/PWAUpdatePrompt'
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isMemberRoute = location.pathname.startsWith('/member');
  const isLoginPage = location.pathname === '/admin/login' || location.pathname === '/member/login';
  
  const hidePublicNavbar = isAdminRoute || isMemberRoute;

  return (
    <div className="bg-brand-darker min-h-screen bg-noise flex flex-col">
      <ScrollToTop />
      <PWAUpdatePrompt />
      {!hidePublicNavbar && <Navbar />}

      <main className={(isAdminRoute || (isMemberRoute && !isLoginPage)) && !isLoginPage ? "flex-grow flex flex-col h-screen overflow-hidden" : "flex-grow"}>
        <Suspense
          fallback={
            <div className="h-screen bg-brand-darker flex items-center justify-center text-brand-gold font-heading text-xl">
              Loading...
            </div>
          }
        >
          <AnimatePresence mode="wait">
            <Routes location={location} key={isAdminRoute ? 'admin' : isMemberRoute ? 'member' : location.pathname}>
              {/* ── Public Routes ────────────────────────────────────── */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/trainers" element={<TrainersPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* ── Blog Routes ──────────────────────────────────────── */}
              <Route path="/blog" element={<BlogIndexPage />} />
              <Route path="/blog/best-gym-in-manimajra" element={<Article1 />} />
              <Route path="/blog/how-to-choose-gym-membership-manimajra" element={<Article2 />} />
              <Route path="/blog/benefits-of-personal-training-manimajra" element={<Article3 />} />
              <Route path="/blog/morning-vs-evening-gym-sessions" element={<Article4 />} />
              <Route path="/blog/beginners-guide-fitness-manimajra" element={<Article5 />} />

              {/* ── SEO Landing Pages ────────────────────────────────── */}
              <Route path="/personal-training-manimajra" element={<PersonalTrainingManimajra />} />
              <Route path="/gym-membership-manimajra" element={<GymMembershipManimajra />} />
              <Route path="/weight-loss-gym-manimajra" element={<WeightLossGymManimajra />} />

              {/* ── Policies ─────────────────────────────────────────── */}
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              {/* ── Admin Login (unprotected) ────────────────────────── */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* ── Admin Dashboard (guarded) ────────────────────────── */}
              <Route
                path="/admin/*"
                element={
                  <AdminGuard>
                    <AdminDashboard />
                  </AdminGuard>
                }
              />

              {/* ── Member Login (unprotected) ───────────────────────── */}
              <Route path="/member/login" element={<MemberLoginPage />} />

              {/* ── Member Dashboard (guarded) ───────────────────────── */}
              <Route
                path="/member"
                element={
                  <MemberGuard>
                    <MemberLayout />
                  </MemberGuard>
                }
              >
                <Route path="dashboard" element={<MemberDashboard />} />
                <Route path="profile" element={<MemberProfilePage />} />
                <Route path="progress" element={<MemberProgressPage />} />
                <Route path="attendance" element={<MemberAttendancePage />} />
                <Route path="attendance/mark" element={<MemberMarkAttendancePage />} />
                <Route path="membership" element={<MemberMembershipPage />} />
                <Route path="diet" element={<MemberDietPage />} />
                <Route path="review" element={<MemberReviewPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* ── Catch-All ────────────────────────────────────────── */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      {!hidePublicNavbar && <Footer />}
      {!hidePublicNavbar && <ChatBot />}
      {!hidePublicNavbar && <CookieBanner />}
      {!hidePublicNavbar && <WhatsAppButton />}
    </div>
  )
}

