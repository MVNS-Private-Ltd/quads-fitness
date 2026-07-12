import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyAdminSession, getSession } from '../../lib/adminAuth';

export default function AdminGuard({ children }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let isMounted = true;

    verifyAdminSession()
      .then((isAdmin) => {
        if (isMounted) {
          setStatus(isAdmin ? 'authenticated' : 'unauthenticated');
        }
      })
      .catch(() => {
        if (isMounted) {
          setStatus('unauthenticated');
        }
      });
      
    // Proactively refresh the session every 10 minutes while the tab is open
    // to prevent the token from expiring if the user stays on the page
    const interval = setInterval(() => {
      getSession().catch(console.error);
    }, 10 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-brand-darker flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/shubham8the8admin/login" replace />;
  }

  return children;
}
