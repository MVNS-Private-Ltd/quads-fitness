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
        // Check if there's an ongoing auth flow in the URL (magic link or OAuth)
        const isAuthCallback = window.location.hash.includes('access_token=') || 
                               window.location.search.includes('code=') ||
                               window.location.hash.includes('error_description=');

        // Check for error in URL (common when magic links are expired by Apple Mail)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);
        const urlError = hashParams.get('error_description') || searchParams.get('error_description');

        if (urlError) {
          console.error("Auth error from URL:", urlError);
          setStatus({ type: 'error', message: urlError.replace(/\+/g, ' ') });
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (error) {
          console.error("Auth session error:", error);
          setStatus({ type: 'error', message: error.message });
          // We will render a Navigate below with the error state
          return;
        }

        if (!session && !isAuthCallback) {
          setStatus('unauthenticated');
          return;
        }

        if (!session && isAuthCallback) {
          // Keep it in 'loading' state; onAuthStateChange will handle it once the code is exchanged
          // Add a timeout fallback in case the exchange fails or link is expired
          setTimeout(() => {
            if (isMounted) {
              setStatus(prev => prev === 'loading' ? 'unauthenticated' : prev);
            }
          }, 5000);
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

  if (status?.type === 'error') {
    return <Navigate to="/member/login" state={{ from: location, authError: status.message || 'Your login link is invalid or has expired. Please request a new one.' }} replace />;
  }

  if (status === 'unauthenticated') {
    // Save intended destination to sessionStorage so it survives magic link navigations
    if (location.pathname !== '/member/login') {
      sessionStorage.setItem('memberLoginRedirect', location.pathname);
    }
    return <Navigate to="/member/login" state={{ from: location }} replace />;
  }

  return children;
}
