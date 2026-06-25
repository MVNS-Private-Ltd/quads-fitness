import rateLimit from 'express-rate-limit';

// Global limiter for general API routes (100 req per minute per IP)
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per `window`
  message: { error: 'Too many requests from this IP, please try again after a minute' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for public endpoints like leads/contact form (5 req per minute)
export const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many submissions. Please wait a minute before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});
