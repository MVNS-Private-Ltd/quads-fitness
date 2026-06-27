import { useState, useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { getMe } from '../../services/memberApi';

export default function MemberGuard({ children }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated' | 'not-found'
  const location = useLocation();
  const mounted = useRef(true);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        // Note: Supabase client is configured with detectSessionInUrl: true,
        // so it automatically handles exchanging the ?code= for a session.
        // We do NOT need to manually call exchangeCodeForSession here, which causes deadlocks.

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (error || !session) {
          setStatus('unauthenticated');
          return;
        }

        // Optimistically authenticate for instant UI rendering
        if (isMounted) setStatus('authenticated');

        // Verify this Supabase user has a matching Member record in our DB in the background
        try {
          await getMe();
        } catch (err) {
          console.error("Member verification error:", err);
          if (isMounted) {
            setStatus('not-found');
            supabase.auth.signOut().catch(console.error);
          }
        }
      } catch (outerErr) {
        console.error("Session check error:", outerErr);
        if (isMounted) {
          setStatus('unauthenticated');
        }
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT') {
        setStatus('unauthenticated');
      } else if (event === 'SIGNED_IN' && session) {
        if (isMounted) setStatus('authenticated');
        try {
          await getMe();
        } catch {
          if (isMounted) setStatus('not-found');
          supabase.auth.signOut().catch(console.error);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-brand-darker flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
          <p className="font-heading text-brand-gold text-sm tracking-widest uppercase">Verifying membership...</p>
        </div>
      </div>
    );
  }

  if (status === 'not-found') {
    return <Navigate to="/member/login" state={{ from: location, notFound: true }} replace />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/member/login" state={{ from: location }} replace />;
  }

  return children;
}
