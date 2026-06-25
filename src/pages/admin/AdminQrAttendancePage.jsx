import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminQrAttendancePage() {
  // The URL that members will scan to mark attendance
  const attendanceUrl = `${window.location.origin}/member/attendance/mark`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 no-print">
        <div>
          <h1 className="text-3xl font-heading text-white tracking-wider uppercase mb-2">QR Attendance</h1>
          <p className="text-white/50 text-sm">Print this QR code and display it at the gym entrance.</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center bg-brand-gold text-brand-darker px-4 py-2 rounded-lg font-semibold hover:bg-brand-gold/90 transition-colors"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print QR Code
        </button>
      </div>

      {/* Printable Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-2xl relative print:shadow-none print:p-0 print:bg-transparent mx-auto max-w-2xl"
      >
        <div className="mb-8 print:mb-12">
          <h2 className="text-4xl font-heading text-brand-darker uppercase tracking-widest mb-4 print:text-black">
            Quads Fitness
          </h2>
          <p className="text-xl text-gray-600 font-medium uppercase tracking-widest print:text-gray-800">
            Scan to mark attendance
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.1)] mb-8 print:shadow-none print:border-8 print:border-black print:p-12">
          <QRCodeSVG 
            value={attendanceUrl} 
            size={300}
            level="H"
            includeMargin={true}
            className="w-64 h-64 md:w-80 md:h-80 print:w-96 print:h-96"
          />
        </div>

        <div className="text-gray-500 font-medium max-w-md print:text-black print:text-lg">
          Please make sure you are logged into the Quads Fitness app on your phone before scanning.
        </div>
        
        {/* Hidden print styles injected here */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body { background: white; }
            .no-print { display: none !important; }
            nav, aside, footer { display: none !important; }
            main { height: auto !important; overflow: visible !important; }
          }
        `}} />
      </motion.div>
    </div>
  );
}
