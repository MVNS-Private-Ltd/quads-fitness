import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <PageTransition>
      <SEO 
        title="Terms & Conditions | Quads Fitness" 
        description="Read the terms and conditions for Quads Fitness memberships, gym rules, liability, and payment policies." 
        url="/terms" 
      />
      <section className="pt-36 pb-24 px-6 max-w-4xl mx-auto">
        <span className="text-xs font-accent uppercase tracking-[0.3em] text-brand-orange block mb-3">// LEGAL</span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display text-white uppercase tracking-tight leading-tight mb-12"
        >
          Terms & Conditions
        </motion.h1>

        <div className="prose prose-invert prose-brand max-w-none space-y-8 text-white/70 font-body text-sm leading-relaxed">
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div>
            <h2 className="text-xl font-display text-white uppercase tracking-wide mb-4 mt-8">1. Membership Terms</h2>
            <p>
              By signing up for a membership at Quads Fitness, you agree to adhere to all facility rules and regulations. Memberships are non-transferable and must be used exclusively by the registered individual. We reserve the right to verify identity upon entry.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-display text-white uppercase tracking-wide mb-4 mt-8">2. Payment and Refund Policy</h2>
            <p>
              All payments for memberships, personal training, and drop-in passes are strictly non-refundable and non-transferable. Billing cycles for subscription-based plans are charged automatically. To cancel an auto-renewing membership, written notice must be provided at least 7 days before the next billing cycle.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-display text-white uppercase tracking-wide mb-4 mt-8">3. Gym Rules and Conduct</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>All members must re-rack weights and wipe down equipment after use.</li>
              <li>Appropriate athletic attire and closed-toe footwear are strictly required on the training floor.</li>
              <li>Disrespectful, aggressive, or inappropriate behavior towards staff or other members will result in immediate termination of membership without refund.</li>
              <li>Dropping weights is permitted only on designated lifting platforms.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-display text-white uppercase tracking-wide mb-4 mt-8">4. Liability Disclaimer</h2>
            <p>
              Quads Fitness is not liable for any personal injury, property damage, or loss sustained on the premises. Members engage in physical activity at their own risk and are advised to consult a medical professional prior to commencing any exercise regimen.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-display text-white uppercase tracking-wide mb-4 mt-8">5. Account Termination</h2>
            <p>
              Management reserves the right to terminate or suspend any membership at any time for violation of these terms, failure to pay dues, or conduct deemed detrimental to the safety and environment of Quads Fitness.
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
