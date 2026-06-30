import QRCode from 'qrcode';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const URL = 'https://quads-fitness.vercel.app/member/dashboard';
const OUTPUT = path.join(__dirname, '../public/install-qr.png');

// Generate QR as PNG buffer with dark theme
const qrBuffer = await QRCode.toBuffer(URL, {
  type: 'png',
  width: 500,
  margin: 3,
  color: {
    dark: '#FF6B00',   // Orange dots
    light: '#111111',  // Dark background
  },
  errorCorrectionLevel: 'H',
});

writeFileSync(OUTPUT, qrBuffer);
console.log(`✅ QR Code saved to: ${OUTPUT}`);

