import { supabaseAdmin } from '../lib/supabaseAdmin.js';
import prisma from '../prisma.js';

// Base helper to verify token
const verifyToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) throw new Error('Invalid token');
  return user;
};

// Base Guard (Token only, no role check)
export const requireBaseAuth = async (req, res, next) => {
  try {
    req.user = await verifyToken(req);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: ' + err.message });
  }
};

// Admin Guard
export const requireAdmin = async (req, res, next) => {
  try {
    const user = await verifyToken(req);

    if (user.app_metadata?.role === 'admin') {
      req.user = user;
      return next();
    }

    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: ' + err.message });
  }
};

// Member Guard
export const requireMember = async (req, res, next) => {
  try {
    const user = await verifyToken(req);
    
    // Look up member by email first, then by phone
    let memberRecord = null;
    if (user.email) {
      memberRecord = await prisma.member.findUnique({ where: { email: user.email } });
    }
    if (!memberRecord && user.phone) {
      // Normalize the phone number for lookup (strip + prefix for matching)
      const phone = user.phone.replace(/^\+91/, '').replace(/^\+/, '');
      memberRecord = await prisma.member.findFirst({ 
        where: { 
          OR: [
            { phone: user.phone },
            { phone: phone },
            { phone: { endsWith: phone.slice(-10) } },
          ]
        } 
      });
    }
    
    if (!memberRecord) {
      return res.status(403).json({ error: 'Forbidden: Member profile required' });
    }
    
    req.user = user;
    req.member = memberRecord;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: ' + err.message });
  }
};
