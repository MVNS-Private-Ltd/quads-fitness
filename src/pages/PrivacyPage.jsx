import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <PageTransition>
      <SEO 
        title="Privacy Policy | Quads Fitness" 
        description="Learn how Quads Fitness collects, uses, and protects your personal data in accordance with Indian data protection laws." 
        url="/privacy" 
      />
      <section className="pt-36 pb-24 px-6 max-w-4xl mx-auto">
        <span className="text-xs font-accent uppercase tracking-[0.3em] text-brand-orange block mb-3">// LEGAL</span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display text-white uppercase tracking-tight leading-tight mb-12"
        >
          Privacy Policy
        </motion.h1>

        <div className="prose prose-invert prose-brand max-w-none space-y-8 text-white/70 font-body text-sm leading-relaxed">
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          <p>
            At Quads Fitness, we are committed to protecting your privacy and complying with the Digital Personal Data Protection (DPDP) Act, 2023 of India. This Privacy Policy outlines how we collect, use, and safeguard your information.
          </p>

          <div>
            <h2 className="text-xl font-display text-white uppercase tracking-wide mb-4 mt-8">1. Information We Collect</h2>
            <p>We collect the following personal information when you register as a member or interact with our services:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Identity & Contact Data:</strong> Full name, email address, phone number, age, gender, and emergency contact details.</li>
              <li><strong>Health & Fitness Data:</strong> Optional health notes, fitness goals, attendance records, and progress logs recorded by your trainer.</li>
              <li><strong>Technical Data:</strong> Cookies and usage data when navigating our website.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display text-white uppercase tracking-wide mb-4 mt-8">2. How We Use Your Data</h2>
            <p>Your data is exclusively used to provide and improve our fitness services. This includes:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Managing your gym membership and tracking expiry dates.</li>
              <li>Sending necessary administrative communications (e.g., membership renewal reminders).</li>
              <li>Providing personalized coaching and tracking fitness progress.</li>
              <li>Ensuring safety and handling medical emergencies.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display text-white uppercase tracking-wide mb-4 mt-8">3. Google OAuth & Third-Party Authentication</h2>
            <p>
              We utilize Google OAuth for seamless member portal access. When you log in via Google, we only access your verified email address to link to your gym membership profile. We do not access your Google contacts, drive, or any other restricted scopes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-display text-white uppercase tracking-wide mb-4 mt-8">4. Data Storage and Security</h2>
            <p>
              Your data is stored securely using enterprise-grade encryption via Supabase. We implement strict access controls ensuring that only authorized administrators and your assigned personal trainer can access your records. We do not sell your personal data to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-display text-white uppercase tracking-wide mb-4 mt-8">5. Your Privacy Rights</h2>
            <p>Under the DPDP Act 2023, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Request access to the personal data we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request the erasure of your personal data upon termination of your membership.</li>
              <li>Withdraw your consent for specific data processing activities.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display text-white uppercase tracking-wide mb-4 mt-8">6. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact our administrative team at the front desk or email us through our Contact page.
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
